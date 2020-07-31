import * as Discord from "discord.js";
import dotenv from "dotenv";
import { Luck, PlayAudio } from "./BotFunction";
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
client.on("message", (message) => {
  if (message.author.bot) return;

  const command = message.content.match(/\S+/g);
  if (!command) return;
  const userCommand = command[0];

  const luck = new Luck();
  const playAudio = new PlayAudio(message, musicQueue);
  const luckCommand = luck.getCommand();
  const playAudioCommand = playAudio.getCommand();
  const helpCommand = "!help";

  if (luckCommand.some((element) => userCommand === element)) {
    if (message.deletable) message.delete();
    message.reply(luck.checkLuck().luckString);
  } else if (userCommand === "!play") {
    playAudio.execute(message.content);
  } else if (userCommand === "!skip") {
    playAudio.skip();
  } else if (userCommand === "!pause") {
    playAudio.pause();
  } else if (userCommand === "!stop") {
    playAudio.stop();
  } else if (userCommand === "!volume") {
    playAudio.volume(parseInt(command[1]));
  } else if (userCommand === helpCommand) {
    const luckString = luck.getName() + "\n" + "Command: " + luckCommand;
    const playAudioString =
      playAudio.getName() + "\n" + "Command: " + playAudioCommand;
    message.channel.send([luckString, playAudioString].join("\n\n"));
  }
  return;
});

client.login(process.env.DISCORD_TOKEN);