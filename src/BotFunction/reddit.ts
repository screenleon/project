import fetch, { Response } from 'node-fetch';
import Discord from 'discord.js';

export class Reddit {
    private name = 'Reddit';
    private command = ['!reddit-hot'];
    private message!: Discord.Message;

    constructor(_message: Discord.Message) {
        this.message = _message;
    }

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
     * Distinguish the user command to run follow methods
     * @param userCommands user command to check which method to run
     */
    public execute = (userCommands: string[] | null) => {
        if (!userCommands || !userCommands[0]) {
            this.getTop5();
        } else {
            switch (userCommands[0]) {
                case 'hot':
                    this.getHot5();
                    break;
                case 'top':
                    this.getTop5();
                    break;
                case 'list':
                    this.getAllSubreddit();
                    break;
                default:
                    this.getSpecificTopic5(userCommands[0]);
                    break;
            }
        }
        return;
    }

    /**
     * Get the subreddit list
     */
    public getAllSubreddit = (): Promise<string | void> => {
        return fetch('https://www.reddit.com/reddits.json?limit=100')
            .then((response: Response) => {
                return response.json();
            }).then((data: any) => {
                if (!data) return;
                return data.data.children.map((element: any) => element.data.display_name);
            }).then((data: string[]) => {
                if (!data) return 'Can\'t fetch Reddit subreddit list';
                this.message.channel.send(
                    new Discord.MessageEmbed()
                        .setDescription(data.join(', ')));
                return;
            })
            .catch((e: Error) => {
                console.error('Get hot 5:', e.message);
                return;
            })
    }

    /**
     * Sort the data and return MessageEmbed and image url arrays
     * @param data json data detch from reddit json api
     */
    private getTop5Topics = (data: any): { embed: Discord.MessageEmbed, images: string[] } => {
        const sortData: any[] = Array.from(data.data.children).sort((a: any, b: any) => {
            return (a.data.ups - b.data.ups) > 0 ? -1 : 1;
        })

        const embed = new Discord.MessageEmbed();
        let top5Images: string[] = [];
        for (let index = 0; index < 5; index++) {
            const element = sortData[index].data;
            let title = element.title as string;
            if (title.length > 200) {
                title = title.substring(0, 200) + '...';
            }
            embed.addField(`${title} in ${element.subreddit}`, `${element.url}`);
            if (!element.over_18)
                top5Images.push(element.thumbnail);
        }
        return { embed, images: top5Images };
    }

    /**
     * Get the Reddit Top 5 articles
     */
    public getTop5 = (): Promise<string | void> => {
        return fetch('https://www.reddit.com/top.json?limit=100')
            .then((response: Response) => {
                return response.json();
            }).then((data: any) => {
                if (!data) return;
                return this.getTop5Topics(data);
            }).then((data: { embed: Discord.MessageEmbed, images: string[] } | void) => {
                if (!data) return 'Can\'t fetch Reddit Top 5';

                this.message.channel.send(data.embed);
                data.images.forEach(element => {
                    if (!!element)
                        this.message.channel.send(element);
                });
                return;
            }).catch((e: Error) => {
                console.error('Get top 5:', e.message);
                return;
            })
    }

    /**
     * Get the Reddit hot 5 articles
     */
    public getHot5 = (): Promise<string | void> => {
        return fetch('https://www.reddit.com/hot.json?limit=100')
            .then((response: Response) => {
                return response.json();
            }).then((data: any) => {
                if (!data) return;
                return this.getTop5Topics(data);
            }).then((data: { embed: Discord.MessageEmbed, images: string[] } | void) => {
                if (!data) return 'Can\'t fetch Reddit Hot 5';

                this.message.channel.send(data.embed);
                data.images.forEach(element => {
                    if (!!element)
                        this.message.channel.send(element);
                });
                return;
            }).catch((e: Error) => {
                console.error('Get hot 5:', e.message);
                return;
            })
    }

    /**
     * Get the Reddit SpecificTopic top 5 articles
     * @param subreddit Reddit's subreddit name
     */
    public getSpecificTopic5 = (subreddit: string): Promise<string | void> => {
        return fetch(`https://www.reddit.com/r/${subreddit}.json?limit=100`)
            .then((response: Response) => {
                if (response.status !== 200) {
                    this.message.channel.send(`Can\'t fetch Reddit ${subreddit} 5`)
                    throw 'subreddit not found';
                }
                return response.json();
            }).then((data: any) => {
                if (!data) return;
                return this.getTop5Topics(data);
            }).then((data: { embed: Discord.MessageEmbed, images: string[] } | void) => {
                if (!data) return;

                this.message.channel.send(data.embed);
                data.images.forEach(element => {
                    if (!!element)
                        this.message.channel.send(element);
                });
                return;
            }).catch((e: Error) => {
                console.error(`Get ${subreddit} 5:`, e.message);
                return;
            })
    }
}