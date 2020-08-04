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
    public execute = (): MessageEmbed => {
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
        const redditHelpDescription = [
            '!reddit:    Get the Top 5 Reddit articles',
            '!reddit top:    Get the Top 5 Reddit articles',
            '!reddit hot:    Get the Hot 5 Reddit articles',
            '!reddit list:    Get the Reddit 100 subreddits',
            '!reddit [args]:    Get the Reddit\'s [args] Top 5 articles'
        ]

        return new MessageEmbed()
            .setTitle('Discord bot')
            .setAuthor('Lien Chen')
            .setURL('http://github.com/screenleon/discord-bot')
            .addFields(
                { name: 'Luck', value: luckHelpDescription.join('\n') },
                { name: 'PlayAudio', value: playAudioHelpDescription.join('\n') },
                { name: 'Help', value: helpHelpDescription.join('\n') },
                { name: 'Reddit', value: redditHelpDescription.join('\n') }
            );
    }
}