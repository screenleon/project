import * as Discord from "discord.js";
import dotenv from "dotenv";
import { Luck, PlayAudio } from "./BotFunction";
dotenv.config({ path: ".env" });

const queue = new Map();
const client = new Discord.Client();

client.once("ready", () => {
  console.log(`Logged in as ${client?.user?.tag}!`);
  return;
});

client.on("message", (message) => {
  if (message.author.bot) return;

  const command = message.content.match(/\S+/g);
  if (!command) return;
  const userCommand = command[0];

  const luck = new Luck();
  const playAudio = new PlayAudio(message, queue);
  const luckCommand = luck.getCommand();
  const playAudioCommand = playAudio.getCommand();
  const helpCommand = "!help";

  if (luckCommand.some((element) => userCommand === element)) {
    message.channel.send(luck.checkLuck().luckString);
  } else if (userCommand === "!play") {
    playAudio.execute(message.content);
  } else if (userCommand === "!skip") {
    playAudio.skip();
  } else if (userCommand === "!pause") {
    playAudio.pause();
  } else if (userCommand === "!stop") {
    playAudio.stop();
  } else if (userCommand === helpCommand) {
    const luckString = luck.getName() + "\n" + "Command: " + luckCommand;
    const playAudioString =
      playAudio.getName() + "\n" + "Command: " + playAudioCommand;
    message.channel.send([luckString, playAudioString].join("\n\n"));
  }
  return;
});

client.login(process.env.DISCORD_TOKEN);
