# Counting Bot

A discord bot made for a simple counting game.

## Requirements

* Node.js v 17.0.0 or newer
* Git installed on your computer

## Installing

To install the packages, run the following commands:

```
git clone https://github.com/Nissekissen/counting-bot.git
cd counting-bot
npm install
```

After the installation finished follow configuration instructions. The run `npm run start` to start the bot.

## Configuration

Copy or Rename `config_.json` to config.json and fillout the values:

⚠️ **Note: Never commit or share your token publicly** ⚠️

```json
{
  "clientId": "BOT_ID",
  "guildId": "SERVER_ID",
  "token": "BOT_TOKEN"
}

```

After you have edited the `config.json` file, you need to run the command `npm run deployl` to deploy all the commands.

## Built With

* [Discord.js](https://discord.js.org/#/) - The Discord API Library used


## Authors

* **REEEEEEEboi** - *All current work* - [Nissekissen](https://github.com/Nissekissen)

See also the list of [contributors](https://github.com/Nissekissen/Equmenia-bot/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Commands and features

Here is a list of the current features and commands:

### Setting up

#### /setup `<channel>`
> Setup the bot and specify a counting channel.

#### /setuphelp
> More specific help on setting up the bot.

### Leaderboards and highscores

#### /score
> Returns the current server score.

#### /leaderboard
> Shows the 5 servers with the highest current score.

#### /highscore
> Returns the current server highscore.

#### /highscores
> Shows a leaderboard with the 5 servers with the best highscore.

### Levels

#### /level `[user]`
> Get your own or someone else's level.
> Returns your own level if left blank.

#### /levels
> Shows the top 5 people in the server with the highest level and score.

#### Settings and configuration

#### /settings
> ##### /settings view
>> View all available settings.
> ##### /settings checkmark `[True|False]`
>> Change whether the bot should react to all messages sent in the counting channel.
>>
> ##### /settings visible `[True|False]`
>> Change whether the server should be visible on the built-in leaderboards.
>> 
> ##### /settings levelcard `[theme] [color]`
>> Change the appearence of your own personal level card.

#### /show
> Make your server visible on the built-in leaderboards.

#### /hide
> Make your server invisible on the built-in leaderboards.

#### /setchannel `<channel>`
> Change the counting channel.

### Other

#### /stats
> ##### /stats user
>> Get stats about yourself.
>> 
> ##### /stats server
>> Get stats about the server.

#### /help
> Shows a list of available commands.

> #### Legend: '<>' means required argument, '[]' means optional argument.

## Any issues, questions or feature requests?

Report issues here on github: [Issues](https://github.com/Nissekissen/counting-bot/issues)

Feel free to join the Support Server if you have any other questions: [Discord link](https://discord.gg/pUFRM3y9Yc)
