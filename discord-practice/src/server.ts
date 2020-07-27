import * as Discord from 'discord.js';
import dotenv from 'dotenv';
import { Luck } from './BotFunction';
dotenv.config({ path: '.env' });

const client = new Discord.Client();

client.once('ready', () => {
    console.log(`Logged in as ${client?.user?.tag}!`)
    return;
})

client.on('message', message => {
    // console.log(message.content);
    // console.log('message client:',message.client);
    // console.log('message id:', message.id);
    // console.log('message member:', message.member)
    if (message.author.bot)
        return;

    const luck = new Luck();
    const luckCommand = luck.getCommand();
    const playCommand = ['a'];
    if (luckCommand.some(element => message.content.search(element) === 0)) {
        const { luckString } = luck.checkLuck();
        message.channel.send(luckString);
    } else if (playCommand.some(element => message.content.search(element) === 0)) {

    }

    return;
});

client.login(process.env.DISCORD_TOKEN);