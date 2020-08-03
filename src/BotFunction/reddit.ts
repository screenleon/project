import fetch, { Response } from 'node-fetch';
import { RedditInterface } from '../Interface';

export class Reddit {
    private name = 'Reddit';
    private command = ['!reddit-hot'];

    public getName = () => {
        return this.name;
    }

    public getCommand = () => {
        return this.command;
    }

    public execute = (userCommands: string[] | null) => {
        if (!userCommands) {
            return this.getTop5();
        } else {
            switch (userCommands[0]) {
                case 'hot':
                    return this.getHot5();
                case 'top':
                    return this.getTop5();
                case 'list':
                    return this.getAllSubreddit();
                default:
                    return this.getSpecificTopic5(userCommands[0]);
            }
        }
    }

    public getAllSubreddit = (): Promise<string | void> => {
        return fetch('https://www.reddit.com/hot.json?limit=100')
            .then((response: Response) => {
                return response.json();
            }).then((data: any) => {
                if (!data) return;
                return data.data.children.map((element: any) => element.data.display_name);
            }).then((data: string[]) => {
                if (!data) return 'Can\'t fetch Reddit subreddit list';
                return data.join(', ');
            })
            .catch((e: Error) => {
                console.error('Get hot 5:', e.message);
                return;
            })
    }

    private getTop5Topics = (data: any): RedditInterface[] => {
        const sortData: any[] = Array.from(data.data.children).sort((a: any, b: any) => {
            return (a.data.ups - b.data.ups) > 0 ? -1 : 1;
        })

        let top5Data: RedditInterface[] = [];
        for (let index = 0; index < 5; index++) {
            const element = sortData[index].data;
            top5Data.push({ subreddit: element.subreddit, title: element.title, url: element.url })
        }
        return top5Data;
    }

    public getTop5 = (): Promise<string | void> => {
        return fetch('https://www.reddit.com/top.json?limit=100')
            .then((response: Response) => {
                return response.json();
            }).then((data: any) => {
                if (!data) return;
                return this.getTop5Topics(data);
            }).then((data: RedditInterface[] | void) => {
                if (!data) return 'Can\'t fetch Reddit Top 5';
                let messageSend: string[] = [];
                for (let index = 0; index < data.length; index++) {
                    messageSend.push(`[${data[0].title}](${data[0].url}) in ${data[0].subreddit}`);
                }
                return messageSend.join('\n');
            }).catch((e: Error) => {
                console.error('Get top 5:', e.message);
                return;
            })
    }

    public getHot5 = (): Promise<string | void> => {
        return fetch('https://www.reddit.com/hot.json?limit=100')
            .then((response: Response) => {
                return response.json();
            }).then((data: any) => {
                if (!data) return;
                return this.getTop5Topics(data);
            }).then((data: RedditInterface[] | void) => {
                if (!data) return 'Can\'t fetch Reddit Hot 5';
                let messageSend: string[] = [];
                for (let index = 0; index < data.length; index++) {
                    messageSend.push(`[${data[0].title}](${data[0].url}) in ${data[0].subreddit}`);
                }
                return messageSend.join('\n');
            }).catch((e: Error) => {
                console.error('Get hot 5:', e.message);
                return;
            })
    }

    public getSpecificTopic5 = (subreddit: string): Promise<string | void> => {
        return fetch(`https://www.reddit.com/r/${subreddit}.json?limit=100`)
            .then((response: Response) => {
                if (response.status !== 200) {
                    throw 'subreddit not found';
                }
                return response.json();
            }).then((data: any) => {
                if (!data) return;
                return this.getTop5Topics(data);
            }).then((data: RedditInterface[] | void) => {
                if (!data) return `Can\'t fetch Reddit ${subreddit} 5`;
                let messageSend: string[] = [];
                for (let index = 0; index < data.length; index++) {
                    messageSend.push(`[${data[0].title}](${data[0].url}) in ${data[0].subreddit}`);
                }
                return messageSend.join('\n');
            }).catch((e: Error) => {
                console.error(`Get ${subreddit} 5:`, e.message);
                return;
            })
    }
}