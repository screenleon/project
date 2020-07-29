export default class {
    private name = '運勢檢查';
    private command = ['!luck', '!運勢'];

    public getName = () => {
        return this.name;
    }

    public getCommand = () => {
        return this.command;
    }

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