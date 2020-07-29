import * as Discord from 'discord.js';
import dotenv from 'dotenv';
import { Luck, PlayAudio } from './BotFunction';
dotenv.config({ path: '.env' });

const queue = new Map();
const client = new Discord.Client();

client.once('ready', () => {
    console.log(`Logged in as ${client?.user?.tag}!`)
    return;
})

client.on('message', message => {
    const userCommand = message.content.match(/\S+/g);
    if (message.author.bot)
        return;

    const luck = new Luck();
    const playAudio = new PlayAudio(message, queue);
    const luckCommand = luck.getCommand();
    const playAudioCommand = playAudio.getCommand();
    const helpCommand = '!help';

    if (!userCommand) return;
    else if (luckCommand.some(element => userCommand[0] === element)) {
        message.channel.send(luck.checkLuck().luckString);
    } else if (playAudioCommand.some(element => userCommand[0] === element)) {
        playAudio.execute(message.content);
    } else if (userCommand[0] === helpCommand) {
        const luckString = luck.getName() + '\n' + 'Command: ' + luckCommand;
        const playAudioString = playAudio.getName() + '\n' + 'Command: ' + playAudioCommand;
        message.channel.send([luckString, playAudioString].join('\n\n'));
    }

    return;
});

client.login(process.env.DISCORD_TOKEN);