import { VoiceChannel, Message, VoiceConnection, StreamDispatcher } from "discord.js";

export interface SongInfo {
    name: string;
    url: string;
}

export interface MusicContract {
    voiceChannel?: VoiceChannel;
    connection?: VoiceConnection;
    songs: SongInfo[];
    volume: number;
    songDispatcher?: StreamDispatcher;
    playing: boolean;
}