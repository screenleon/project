import { VoiceChannel, Message, VoiceConnection, StreamDispatcher } from "discord.js";

export interface SongInfo {
    title: string;
    url: string;
}

export interface MusicContract {
    textChannel: Message["channel"];
    voiceChannel?: VoiceChannel;
    connection?: VoiceConnection;
    songs: SongInfo[];
    volume: number;
    songDispatcher?: StreamDispatcher;
    playing: boolean;
}