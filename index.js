const fs = require("fs");
const http = require("http");
const discord = require("discord.js");
const config = require("./config/config");
const db = new Map();

// Creating a new client:
const client = new discord.Client({
  partials: [
    discord.Partials.Channel, // for text channel
    discord.Partials.GuildMember, // for guild member
    discord.Partials.User, // for discord user
  ],
  intents: [
    discord.GatewayIntentBits.Guilds, // for guild related things
    discord.GatewayIntentBits.GuildMembers, // for guild members related things
    discord.GatewayIntentBits.GuildIntegrations, // for discord Integrations
    discord.GatewayIntentBits.GuildVoiceStates, // for voice related things
  ],
  presence: {
    activities: [
      {
        name: "mind games",
        type: 0,
      },
    ],
    status: "online",
  },
});

client.prefix_commands = {};

http.createServer((req, res) => res.end("ready")).listen(443);

fs.readdirSync("./events")
  .filter((e) => e.endsWith(".js"))
  .forEach((file) => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event(client));
    console.log(`[events] loaded event file => ${eventName}`);
  });

// commands handler
fs.readdirSync("./commands")
  .filter((e) => e.endsWith(".js"))
  .forEach((file) => {
    let pull = require(`./commands/${file}`);

    if (!pull.config.name)
      return console.log(
        `[commands] Couldn't load the file ${file}, missing module name value.`
      );

    client.prefix_commands[pull.config.name] = pull;
    console.log(`[commands] Loaded a file: ${pull.config.name}`);
  });

// Login to the bot:
client.login(process.env.TOKEN).catch((err) => {
  console.error("[crash] Something went wrong while connecting to your bot...");
  console.error("[crash] Error from Discord API:" + err);
  return process.exit();
});

// Handle errors:
process.on("unhandledRejection", async (err, promise) => {
  console.error(`[anti-crash] Unhandled Rejection: ${err}`);
  console.error(promise);
});
