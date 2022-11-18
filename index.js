const http = require('http')
const discord = require('discord.js');
const config = require('./config/config');

// Creating a new client:
const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.GuildPresences,
    discord.GatewayIntentBits.GuildMessageReactions,
    discord.GatewayIntentBits.DirectMessages,
    discord.GatewayIntentBits.MessageContent
  ],
  partials: [
    discord.Partials.Channel,
    discord.Partials.Message,
    discord.Partials.User,
    discord.Partials.GuildMember,
    discord.Partials.Reaction
  ],
  presence: {
    activities: [{
      name: "mind games",
      type: 0
    }],
    status: 'online'
  }
});

client.events = new discord.Collection()

http.createServer((req, res) => res.end('ready')).listen(443);

if (!process.env.TOKEN) {
  console.error("[crash] Authentication Token for Discord bot is required! Use Envrionment Secrets.")
  process.exit();
};

fs.readdirSync('./events/')
  .filter(file => file.endsWith('.js'))
  .forEach(dir => {
    let evfile = require(`../events/${file}`);
    if (evfile.name) return console.log(`[events] Couldn't load the file ${file}. missing name or aliases.`);

    client.events.set(evfile.name, evfile);
    console.log(`[events] Loaded a file: ${evfile.name}`)
  });

// Login to the bot:
client.login(process.env.TOKEN).catch((err) => {
  console.error("[crash] Something went wrong while connecting to your bot...");
  console.error("[crash] Error from Discord API:" + err);
  return process.exit();
});

// Handle errors:
process.on('unhandledRejection', async (err, promise) => {
  console.error(`[anti-crash] Unhandled Rejection: ${err}`);
  console.error(promise);
});
