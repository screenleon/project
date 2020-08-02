import { Message, Guild } from 'discord.js';
import ytdl from 'ytdl-core';
import { MusicContract } from '../Interface';
const ytlist = require('youtube-playlist');

export class PlayAudio {
    private name = 'Play Audio';
    private command = ['!play', '!skip', '!pause', '!stop', '!volume'];
    private ytRegexp = /(?:http?s?:\/\/)?(?:www.)?(?:m.)?(?:music.)?youtu(?:\.?be)(?:\.com)?(?:(?:\w*.?:\/\/)?\w*.?\w*-?.?\w*\/(?:embed|e|v|watch|playlist|.*\/)?\??(?:feature=\w*\.?\w*)?&?(?:v=|list=)?\/?)([\w\d_-]{11})(?:\S+)?/;
    private message: Message;
    private musicQueue!: MusicContract;
    private botMusicqueue: Map<string, MusicContract>;
    private guild!: Guild;
    private lastPlayTime!: number;

    constructor(_message: Message, _queue: Map<string, any>) {
        this.message = _message;
        this.botMusicqueue = _queue;
        if (!this.message.guild) return;
        this.guild = this.message.guild;
        this.lastPlayTime = Date.now();
        if (!this.botMusicqueue.has(this.guild.id))
            this.musicQueue = { songs: [], volume: 10, playing: false };
        else
            this.musicQueue = this.botMusicqueue.get(this.guild.id) as MusicContract;
    }

    /**
     * Get this class name
     */
    public getName = () => {
        return this.name;
    }

    /**
     * Get this class command
     */
    public getCommand = () => {
        return this.command;
    }

    /**
     * Fetch youtube'url in command. If musicQueue not initial, initial it and start play song, else push song into musicQueue.songs.
     * @param command discord's command
     */
    public execute = (command: string) => {
        const voiceChannel = this.message.member?.voice.channel;
        if (!voiceChannel) {
            this.message.reply('Please be in a voice channel first!');
            return;
        }
        if (!this.message.client.user) return;
        const permissions = voiceChannel.permissionsFor(this.message.client.user);
        if (!permissions?.has("CONNECT") || !permissions?.has("SPEAK")) {
            this.message.channel.send(
                "I need the permissions to join and speak in your voice channel!"
            );
            return;
        }

        const matchYT = this.ytRegexp.exec(command);
        if (command === this.command[0] && this.musicQueue.songs.length !== 0) {
            this.play();
            return;
        }
        if (!matchYT) {
            this.message.channel.send('Please type Youtube website!');
            return;
        };

        new Promise(resolve => {
            resolve()
        }).then(() => {
            if (matchYT[0].search(/list/) < 0) {
                return this.getSong(matchYT[0]);
            } else {
                return this.getSongList(matchYT[0]);
            }
        }).then(songInfoList => {
            switch (songInfoList.length) {
                case 0:
                    this.message.channel.send(`**${matchYT[0]}** might be wrong`);
                    return;
                case 1:
                    this.message.channel.send(`**${songInfoList[0].name}** has been added to the queue`);
                    break;
                default:
                    this.message.channel.send(`Added ${songInfoList.length} songs to the queue`);
                    break;
            }

            if (this.musicQueue.songs.length === 0) {
                if (!this.musicQueue.hasOwnProperty('voiceChannel')) this.musicQueue.voiceChannel = voiceChannel;
                this.musicQueue.songs.push(...songInfoList);
                this.botMusicqueue.set(this.guild.id, this.musicQueue);
                return voiceChannel.join();
            }
            this.musicQueue.songs.push(...songInfoList);
            this.botMusicqueue.set(this.guild.id, this.musicQueue);
            return;
        }).then(voiceConnection => {
            if (!voiceConnection) return;
            voiceConnection
                .on('disconnect', listener => {
                    this.resetMusicQueue();
                })
            if (!this.musicQueue.connection) this.musicQueue.connection = voiceConnection;
            this.play();
            return;
        }).catch((e: Error) => {
            console.error('Execute error:', e.message)
            this.botMusicqueue.delete(this.guild.id);
            this.message.channel.send(e);
            return;
        })
    }

    /**
     * Get the song without list
     * @param url youtube url
     */
    private getSong = (url: string): Promise<{ name: string, url: string }[]> => {
        return ytdl.getInfo(url)
            .then(songInfo => {
                return [{ name: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url }];
            });
    }

    /**
     * Get the songs with list in query
     * @param url youtube url with list
     */
    private getSongList = (url: string): Promise<{ name: string, url: string }[]> => {
        return ytlist(url, ['name', 'url'])
            .then((res: { data: { name: string, playlist: { name: string, url: string }[] } }) => {
                if (!res.data.name) {
                    console.error(`This playlist don\'t have name, can not get the songs`);
                    return this.getSong(url);
                }

                return !!res ? res.data.playlist : [];
            }).catch((e: Error) => {
                console.error('Get song list error:', e.message)
                return;
            });
    }

    /**
     * Set the StreamPatcher's event and play the song in musicQueue.songs
     */
    private play = () => {
        const song = this.musicQueue.songs[0];
        const checkPlayNextSongMilliSecond = 10;
        if (!song) {
            this.musicQueue.songDispatcher?.emit('stop');
            return;
        } else if (!!this.musicQueue.songDispatcher && this.musicQueue.songDispatcher.totalStreamTime - this.musicQueue.songDispatcher.streamTime > checkPlayNextSongMilliSecond) {
            this.musicQueue.songDispatcher.emit('playing');
            return;
        }

        const dispatcher = this.musicQueue.connection?.play(
            ytdl(song.url)
                .on('error', e => {
                    console.error('Play ytdl error:', `${e.message} is unvailable`)
                    this.message.channel.send(`${this.musicQueue.songs[0].name} has restricted which maybe **Regionally restricted, Private or Rentals**`);
                    this.skip();
                    return;
                }))
            .once('start', () => {
                this.musicQueue.playing = true;
                this.botMusicqueue.set(this.guild.id, this.musicQueue);
                this.message.channel.send(`Start playing: **${song.name}**`);
                return;
            })
            .on('playing', () => {
                if (this.musicQueue.playing === false) {
                    this.musicQueue.songDispatcher?.resume();
                    this.lastPlayTime = Date.now();
                    this.musicQueue.playing = true;
                    this.botMusicqueue.set(this.guild.id, this.musicQueue);
                    this.message.channel.send(`Resume playing: **${this.musicQueue.songs[0].name}**`);
                    return;
                } else {
                    this.message.channel.send(`Already playing`);
                    return;
                }
            })
            .on('pause', (time: number = 5) => {
                if (!this.musicQueue.playing) {
                    this.message.channel.send(`Already pause the song!`);
                    return;
                }

                setTimeout(() => {
                    if (Date.now() - this.lastPlayTime < time * 60 * 1000) {
                        return;
                    }
                    this.musicQueue.songDispatcher?.emit('stop');
                    return;
                }, time * 60 * 1000)

                this.musicQueue.songDispatcher?.pause();
                this.lastPlayTime = Date.now();
                this.musicQueue.playing = false;
                this.botMusicqueue.set(this.guild.id, this.musicQueue);
                this.message.channel.send(`Pause playing: **${this.musicQueue.songs[0].name}**`);
                return;
            })
            .on('finish', () => {
                if (!!this.musicQueue.voiceChannel && !(this.musicQueue.voiceChannel.members.size > 1)) {
                    this.stop();
                    return;
                }
                this.musicQueue.songs.shift();
                this.botMusicqueue.set(this.guild.id, this.musicQueue);
                this.play();
                return;
            })
            .on('stop', (time: number = 30) => {
                setTimeout(() => {
                    const musicQueue = this.botMusicqueue.get(this.guild.id);
                    if (!musicQueue?.songs || musicQueue?.songs.length === 0) {
                        this.musicQueue.connection?.disconnect();
                        this.resetMusicQueue();
                    }
                    return;
                }, time * 1000);

                this.musicQueue.songs = [];
                this.clearDispatcher();
                this.botMusicqueue.delete(this.guild.id);
                this.message.channel.send('Stop playing');
                return;
            })
            .on('error', e => {
                console.error('Play error:', e.message)
                return;
            })

        dispatcher?.setVolume(this.musicQueue.volume / 100);
        this.musicQueue.songDispatcher = dispatcher;
        this.botMusicqueue.set(this.guild.id, this.musicQueue);
        return;
    }

    /**
     * Emit StreamDispatcher's pause event, pass the idle timeout time(minutes).
     * @param time minutes, Default 5 minutes
     */
    public pause = (time: number = 5) => {
        !this.musicQueue.songDispatcher
            ? this.message.channel.send(`There is no songs in queue!`)
            : this.musicQueue.songDispatcher.emit('pause', time);
        return
    }

    /**
     * If musicQueue.songs not empty, emit musicQueue.songDispatcher finish event
     */
    public skip = () => {
        switch (this.musicQueue.songs.length) {
            case 0:
                this.message.channel.send('There is no songs in queue!')
                return;
            default:
                this.musicQueue.songDispatcher?.emit('finish');
                return;
        }
    };

    /**
     * Emit StreamDispatcher's stop event, pass the leave voice channel timeout time(seconds).
     * @param time seconds, Default 30 seconds
     */
    public stop = (time: number = 30) => {
        this.musicQueue.songDispatcher?.emit('stop', time);
        return;
    }

    /**
     * If volume is null, get the music volume, else set the music volume
     * @param volume 0 ~ 200, or null
     */
    public volume = (volume?: number) => {
        if (!this.musicQueue.songDispatcher) {
            this.message.channel.send('Bot is not playing music!');
            return
        }

        if (!volume) {
            if (this.message.deletable) this.message.delete();
            this.message.channel.send(`Now volume is **${this.musicQueue.volume}**`);
        } else {
            this.musicQueue.volume = volume > 200 ? 200 : volume < 0 ? 0 : volume;
            this.musicQueue.songDispatcher?.setVolume(this.musicQueue.volume / 100);
            this.botMusicqueue.set(this.guild.id, this.musicQueue);
            if (this.message.deletable) this.message.delete();
            this.message.channel.send(`Set the volume to **${this.musicQueue.volume}**`);
        }
        return;
    }

    /**
     * Clear musicQueue.songs, musicQueue.playing reset, and remove musicQueue.songDispatcher, save to botMusicQueue.
     */
    private clearDispatcher = () => {
        this.musicQueue.songs = [];
        this.musicQueue.playing = false;
        this.musicQueue.songDispatcher?.end();
        delete this.musicQueue.songDispatcher;
        this.botMusicqueue.set(this.guild.id, this.musicQueue);
        return;
    }


    /**
     * Reset the musicQueue to initial, and delete this id's MusicQueue in bot queue.
     */
    private resetMusicQueue = () => {
        this.clearDispatcher();
        delete this.musicQueue.connection;
        delete this.musicQueue.voiceChannel;
        this.botMusicqueue.delete(this.guild.id);
        return;
    }
}