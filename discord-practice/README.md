# Discord Practice
## Instruction
1. Add the bot from [Discord development](https://discord.com/developers/), and get the discord clientId, PERMISSIONS_INTEGER, token.W
2. Use `https://discordapp.com/oauth2/authorize?client_id=<Bot_Client_ID>&scope=bot&permissions=<PERMISSIONS_INTEGER>` to add bot to server.
3. Add .env file on root folder, and write down your DISCORD_TOKEN in it. Ex. `DISCORD_TOKEN=XXXX`.
4. Start dev server: `npm run start:dev`. It can auto restart server after save file.

## Features
1. Luck
    * Check daily luck
    * Command: !luck, !運勢
2. Play Audio
    * Play youtube song
    * Record input song
    * Command: !p

## Willing
* Play Audio
    * Play, Stop, Skip songs
    * Load list youtube songs by an url.
* Get the latest reddit news
* Build by docker-compose

## Reference
* [Discord development](https://discord.com/developers/)