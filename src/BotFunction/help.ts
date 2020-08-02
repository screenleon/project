export class Help {
    private name = 'Help';
    private command = ['!help'];

    public getName = () => {
        return this.name;
    }

    public getCommand = () => {
        return this.command;
    }

    public help = (): string => {
        const luckHelpText = ['Luck','!luck\tReply your luck'];
        const playAudioHelpText = [
            'PlayAudio',
            '!play [args]\tCan queue the song or the list songs with youtube website',
            '!play\tResume the pause song',
            '!pause\tPause the playing song',
            '!skip\tSkip the current song',
            '!stop\tStop playing songs, clear the song queue',
            '!volume [args]\tAdjust the current bot volume, default is 10, range from 1 to 200',
            '!volume\tGet the current bot volume'
        ];

        const helpHelpText = ['Help', '!help\tGet the help document'];

        return [luckHelpText.join('\n'), playAudioHelpText.join('\n'), helpHelpText.join('\n')].join('\n\n');
    }
}