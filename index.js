const {
  Client,
  Partials,
  Collection,
  GatewayIntentBits,
} = require("discord.js");
const chalk = require("chalk");
const config = require("./config/config");

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

// Host the bot:
require("http")
  .createServer((req, res) => res.end("Ready."))
  .listen(3000);

// Getting the bot token:
const AuthenticationToken = process.env.DISCORD_TOKEN;
if (!AuthenticationToken) {
  console.warn(
    chalk.red(
      "[CRASH] Authentication Token for Discord bot is required! Use Envrionment Secrets or config.js."
    )
  );
  process.exit();
}

// Handler:
client.events = new Collection();
client.aliases = new Collection();
client.slash_commands = new Collection();
client.prefix_commands = new Collection();

require("./handlers/events")(client);
require("./handlers/prefix")(client);
require("./handlers/slash")(client, config);

// Login to the bot:
client
  .login(AuthenticationToken)
  .then(() => {
    console.log(chalk.greenBright("[Auth] Authentication successfull"));
  })
  .catch((err) => {
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
