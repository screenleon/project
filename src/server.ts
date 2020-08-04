import * as Discord from "discord.js";
import dotenv from "dotenv";
import { Luck, PlayAudio, Help, Reddit } from "./BotFunction";
dotenv.config({ path: ".env" });

const musicQueue = new Map();
const client = new Discord.Client();

/**
 * If success log in the bot, print out the bot tag
 */
client.once("ready", () => {
  console.log(`Logged in as ${client?.user?.tag}!`);
  return;
});

/**
 * Check the user's input, find the command and run it 
 */
client.on("message", (message: Discord.Message) => {
  if (message.author.bot) return;

  const command = message.content.match(/\S+/g);
  if (!command) return;
  const userCommand = command[0];

  const luck = new Luck();
  const playAudio = new PlayAudio(message, musicQueue);
  const reddit = new Reddit(message);
  const help = new Help();

  switch (userCommand) {
    case '!luck':
      if (message.deletable) message.delete();
      message.reply(luck.checkLuck().luckString);
      break;
    case '!play':
      playAudio.execute(message.content);
      break;
    case '!skip':
      playAudio.skip();
      break;
    case '!pause':
      playAudio.pause();
      break;
    case '!stop':
      playAudio.stop();
      break;
    case '!volume':
      playAudio.volume(parseInt(command[1]));
      break;
    case '!help':
      message.channel.send(help.execute());
      break;
    case '!reddit':
      reddit.execute(command.slice(1));
      break;
  }

  return;
});

client.login(process.env.DISCORD_TOKEN);