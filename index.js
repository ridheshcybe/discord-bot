const fs = require("fs");
const http = require("http");
const Eris = require("eris");
const config = require("./config/config");

// Creating a new client:
const client = new Eris(process.env.TOKEN, {
  intents: ["guildMessages"],
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

const commands = {};

http.createServer((req, res) => res.end("ready")).listen(443);

// commands handler
fs.readdirSync("./commands")
  .filter((e) => e.endsWith(".js"))
  .forEach((dir) => {
    let pull = require(`./commands/${file}`);

    if (pull.config.name)
      return console.log(
        `[prefix] Couldn't load the file ${file}, missing module name value.`
      );

    commands[pull.config.name] = pull;
    console.log(
      `[prefix] Loaded a file: ${pull.config.name} (#${client.commands.size})`
    );
  });

// message generate event
client.on("messageCreate", async (message) => {
  if (message.channel.type !== 0) return;
  if (message.author.bot) return;

  const prefix = config.prefix || "?";

  if (!message.content.startsWith(prefix)) return;
  if (!message.guild) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;

  if (!commands[cmd]) return;

  try {
    await commands[cmd].run(client, message, args, config);
  } catch (e) {
    console.error(e);
  }
});

// ready event
client.once("ready", async () => {
  console.log(`[ready] ${client.user.tag} is up and ready to go.`);
});

// Login to the bot:
client.connect().catch((err) => {
  console.error("[crash] Something went wrong while connecting to your bot...");
  console.error("[crash] Error from Discord API:" + err);
  return process.exit();
});

// Handle errors:
process.on("unhandledRejection", async (err, promise) => {
  console.error(`[anti-crash] Unhandled Rejection: ${err}`);
  console.error(promise);
});
