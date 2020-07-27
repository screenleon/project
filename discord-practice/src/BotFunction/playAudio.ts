import { Client, Structures, Message } from 'discord.js';
import ytdl from 'ytdl-core';

export default class {
    private name = 'Play Audio';
    private command = ['!p'];
    private ytRegexp = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/g;

    private message: Message;

    constructor(_message: Message) {
        this.message = _message;
    }

    public getName = () => {
        return this.name;
    }

    public getCommand = () => {
        return this.command;
    }

    public play = (url: string) => {
        const voiceChannel = this.message.member?.voice.channel;
        if (!voiceChannel) {
            this.message.reply('Please be in a voice channel first!');
            return;
        }

        voiceChannel
            .join()
            .then(res => {
                return res.play(ytdl(url, { filter: 'audioonly' }));
            }).then(streamDispatcher => {
                streamDispatcher.on('speaking', speaking => {
                    if (!speaking) voiceChannel.leave();
                })
            }).catch(e => {
                console.error(e);
            });
    }

}