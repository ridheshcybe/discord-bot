const {
  Client,
  Partials,
  Collection,
  GatewayIntentBits,
} = require("discord.js");
const chalk = require("chalk");
const config = require("./config/config");
const { Player } = require("discord-player");

// Creating a new client:
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction,
  ],
  presence: {
    activities: [
      {
        name: "mind games",
        type: 0,
      },
    ],
    status: "dnd",
  },
});

const player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
    requestOptions: {
      headers: {
        cookie: "YOUR_YOUTUBE_COOKIE",
      },
    },
  },
});

player.on("error", (queue, error) => {
  console.log(`${queue.guild.name} An Error has occurred ${error}`, "error");
});

player.on("connectionError", (queue, error) => {
  console.log(`Error emitted from the connection ${error.message}`);
});

player.on("botDisconnect", (queue) => {
  console.log(`${queue.guild.name} Disconnected from Channel`);
});

player.on("connectionCreate", (queue, connection) => {
  console.log(
    `${queue.guild.name}: Bot has successfully connected to Voice Channel!`
  );
});

player.on("connectionError", (queue, error) => {
  console.log(
    `${queue.guild.name}: There has been a connection error, ${error.message}`
  );
});

player.on("queueEnd", (queue) => {
  console.log(`${queue.guild.name}: Queue has finished playing!`);
});

player.on("trackAdd", (queue, track) => {
  console.log(`${queue.guild.name}: ${track.title} has been added!`);
});

player.on("trackEnd", (queue, track) => {
  console.log(`${queue.guild.name}: ${track.title} has finished playing!`);
});

player.on("tracksAdd", (queue, tracks) => {
  console.log(
    `${queue.guild.name}: A playlist with ${tracks.length} songs has beed added!`
  );
});

player.on("trackStart", (queue, track) => {
  console.log(`${queue.guild.name}: ${track.title} has started playing`);
});

// Host the bot:
require("http")
  .createServer((req, res) => res.end("Ready."))
  .listen(3000);

// Getting the bot token:
const AuthenticationToken = process.env.TOKEN;
if (!AuthenticationToken) {
  console.warn(
    chalk.red(
      "[CRASH] Authentication Token for Discord bot is required! Use Envrionment Secrets or config.js."
    )
  );
  process.exit();
}

// Handler:
client.player = player;
client.events = new Collection();
client.aliases = new Collection();
client.user_commands = new Collection();
client.slash_commands = new Collection();
client.prefix_commands = new Collection();
client.message_commands = new Collection();

["prefix", "application_commands", "events"].forEach((file) => {
  require(`./handlers/${file}`)(client, config);
});

// Login to the bot:
client.login(AuthenticationToken).catch((err) => {
  console.error(
    chalk.red("[CRASH] Something went wrong while connecting to your bot...")
  );
  console.error(chalk.red("[CRASH] Error from Discord API:" + err));
  return process.exit();
});

// Handle errors:
process.on("unhandledRejection", async (err, promise) => {
  console.error(chalk.red(`[ANTI-CRASH] Unhandled Rejection: ${err}`));
  console.error(promise);
});

module.exports = client;
