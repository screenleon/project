import { Message, Guild } from 'discord.js';
import ytdl from 'ytdl-core';
import { MusicContract, SongInfo } from '../Interface';

export default class {
    private name = 'Play Audio';
    private command = ['!play', '!skip', '!pause', '!stop'];
    private ytRegexp = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/g;
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
            this.musicQueue = { textChannel: this.message.channel, songs: [], volume: 5, playing: false };
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
        ytdl.getInfo(matchYT[0])
            .then(songInfo => {
                const song: SongInfo = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url };
                if (this.musicQueue.songs.length === 0) {
                    if (this.musicQueue.hasOwnProperty('voiceChannel')) this.musicQueue.voiceChannel = voiceChannel;
                    this.musicQueue.songs.push(song);
                    return voiceChannel.join();
                }
                this.musicQueue.songs.push(song);
                this.botMusicqueue.set(this.guild.id, this.musicQueue);
                this.message.channel.send(`${song.title} has been added to the queue`);
                return;
            }).then(voiceConnection => {
                if (!voiceConnection) return;
                if (!this.musicQueue.connection) this.musicQueue.connection = voiceConnection;
                this.play();
            }).catch(e => {
                console.error(e);
                this.botMusicqueue.delete(this.guild.id);
                this.message.channel.send(e);
                return;
            })
    }

    /**
     * Set the StreamPatcher's event and play the song in musicQueue.songs
     */
    private play = () => {
        const song = this.musicQueue.songs[0];
        const checkPlayNextSongMilliSecond = 10;
        if (!song) {
            this.musicQueue.voiceChannel?.leave();
            this.botMusicqueue.delete(this.guild.id);
            return;
        } else if (!!this.musicQueue.songDispatcher && this.musicQueue.songDispatcher.totalStreamTime - this.musicQueue.songDispatcher.streamTime > checkPlayNextSongMilliSecond) {
            this.musicQueue.songDispatcher.emit('playing');
            return;
        }

        const dispatcher = this.musicQueue.connection?.play(ytdl(song.url))
            .once('start', () => {
                this.musicQueue.playing = true;
                this.botMusicqueue.set(this.guild.id, this.musicQueue);
            })
            .on('playing', () => {
                if (this.musicQueue.playing === false) {
                    this.musicQueue.songDispatcher?.resume();
                    this.lastPlayTime = Date.now();
                    this.musicQueue.playing = true;
                    this.botMusicqueue.set(this.guild.id, this.musicQueue);
                    this.musicQueue.textChannel.send(`Resume playing: **${this.musicQueue.songs[0].title}**`);
                    return;
                } else {
                    this.musicQueue.textChannel.send(`Already playing`);
                    return;
                }
            })
            .on('pause', (time: number = 5) => {
                const textChannel = this.musicQueue.textChannel;
                if (!this.musicQueue.playing) {
                    textChannel.send(`Already pause the song!`);
                    return;
                }

                setTimeout(() => {
                    console.log('pause timeout');
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
                textChannel.send(`Pause playing: **${this.musicQueue.songs[0].title}**`);
                return;
            })
            .on('finish', () => {
                this.musicQueue.songs.shift();
                this.botMusicqueue.set(this.guild.id, this.musicQueue);
                this.play();
                return;
            })
            .on('stop', (time: number = 30) => {
                setTimeout(() => {
                    const musicQueue = this.botMusicqueue.get(this.guild.id);
                    if (!musicQueue) {
                        this.musicQueue.connection?.disconnect();
                        this.resetMusicQueue();
                    }
                    return;
                }, time * 1000);

                this.musicQueue.songs = [];
                this.clearDispatcher();
                this.botMusicqueue.delete(this.guild.id);
                return;
            })
            .on('error', e => {
                console.error(e);
            })

        dispatcher?.setVolumeLogarithmic(this.musicQueue.volume / 5);
        this.musicQueue.songDispatcher = dispatcher;
        this.botMusicqueue.set(this.guild.id, this.musicQueue);
        this.musicQueue.textChannel.send(`Start playing: **${song.title}**`);
        return;
    }

    /**
     * Emit StreamDispatcher's pause event, pass the idle timeout time(minutes).
     * @param time minutes, Default 5 minutes
     */
    public pause = (time: number = 5) => {
        if (!this.musicQueue.songDispatcher) {
            this.musicQueue.textChannel.send(`There is no songs in queue!`);
            return;
        } else
            this.musicQueue.songDispatcher.emit('pause', time);
        return
    }

    /**
     * If songs more than one, then emit StreamDispatcher's finish event.
     */
    public skip = () => {
        switch (this.musicQueue.songs.length) {
            case 0:
                this.message.channel.send('Music Queue is empty!')
                break;
            case 1:
                this.message.channel.send('The song is the last one!');
                break;
            default:
                this.musicQueue.songDispatcher?.emit('finish');
                break;
        }
    };

    /**
     * Emit StreamDispatcher's stop event, pass the leave voice channel timeout time(seconds).
     * @param time seconds, Default 30 seconds
     */
    public stop = (time: number = 30) => {
        this.musicQueue.textChannel.send('Stop playing');
        this.musicQueue.songDispatcher?.emit('stop', time);
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