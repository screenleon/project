export class Luck{
    private name = '運勢檢查';
    private command = ['!luck'];

    /**
     * Get the class name
     */
    public getName = () => {
        return this.name;
    }

    /**
     * Get the class command
     */
    public getCommand = () => {
        return this.command;
    }

    /**
     * Random number and send the lucky string
     */
    public checkLuck = () => {
        const luckNumber = Math.floor(Math.random() * 7);
        switch (luckNumber) {
            case 6:
                return { luckNumber, luckString: '歐洲人降臨，10連出貨沒問題啦' };
            case 5:
                return { luckNumber, luckString: '只是混到一點非洲血統的亞洲人' };
            case 4:
                return { luckNumber, luckString: '混到亞洲血統的非洲人' };
            default:
                return { luckNumber, luckString: '非洲人不解釋' };
        }
    }
}