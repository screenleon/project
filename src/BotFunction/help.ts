import { MessageEmbed } from "discord.js";

export class Help {
    private name = 'Help';
    private command = ['!help'];

    /**
     * Get class name
     */
    public getName = () => {
        return this.name;
    }

    /**
     * Get class command
     */
    public getCommand = () => {
        return this.command;
    }

    /**
     * Get the Help instruction to Discord MessageEmbed
     */
    public help = (): MessageEmbed => {
        const luckHelpDescription = ['!luck:    Reply your luck'];
        const playAudioHelpDescription = [
            '!play [args]:    Can queue the song or the list songs with youtube website',
            '!play:    Resume the pause song',
            '!pause:    Pause the playing song',
            '!skip:    Skip the current song',
            '!stop:    Stop playing songs, clear the song queue',
            '!volume [args]:    Adjust the current bot volume, default is 10, range from 1 to 200',
            '!volume:    Get the current bot volume'
        ];
        const helpHelpDescription = ['!help:    Get the help document'];

        return new MessageEmbed()
            .setTitle('Discord bot')
            .setAuthor('Lien Chen')
            .addFields(
                { name: 'Luck', value: luckHelpDescription.join('\n') },
                { name: 'PlayAudio', value: playAudioHelpDescription.join('\n') },
                { name: 'Help', value: helpHelpDescription.join('\n') }
            )
            .setURL('http://github.com/screenleon/discord-bot');
    }
}