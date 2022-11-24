const fs = require("fs");
const http = require("http");
const discord = require("discord.js");

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
client.config = require("./config/config.json");

// server handler
http.createServer((req, res) => res.end("ready")).listen(443);

// commands handler
fs.readdirSync("./commands")
  .filter((e) => e.endsWith(".js"))
  .forEach((file) => {
    let pull = require(`./commands/${file}`);

    if (!pull.config.name)
      return console.log(
        `[commands] Couldn't load the file ${file}, missing module name value.`
      );

    client.prefix_commands[file.split(".")[0]] = pull;
    console.log(`[commands] Loaded a file: ${pull.config.name}`);
  });

// Ready event
client.on("ready", () => {
  console.log(`[ready] ${client.user.tag} is up and ready to go.`);
});

// message create event
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const prefix = config.prefix || "?";

  if (!message.content.startsWith(prefix)) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;

  let command = client.prefix_commands[cmd];

  if (!command) return;

  if (command) {
    if (command.permissions) {
      if (
        !message.member.permissions.has(
          discord.PermissionsBitField.resolve(command.permissions || [])
        )
      )
        return message.reply({
          embeds: [
            new discord.EmbedBuilder()
              .setDescription(
                `🚫 Unfortunately, you are not authorized to use this command.`
              )
              .setColor("Red"),
          ],
        });
    }

    if ((command.owner, command.owner == true)) {
      if (config.owners) {
        const allowedUsers = []; // New Array.

        config.owners.forEach((user) => {
          const fetchedUser = message.guild.members.cache.get(user);
          if (!fetchedUser) return allowedUsers.push("*Unknown User#0000*");
          allowedUsers.push(`${fetchedUser.user.tag}`);
        });

        if (!config.owners.some((ID) => message.member.id.includes(ID)))
          return message.reply({
            embeds: [
              new discord.EmbedBuilder()
                .setDescription(
                  `🚫 Sorry but only owners can use this command! Allowed users:\n**${allowedUsers.join(
                    ", "
                  )}**`
                )
                .setColor("Red"),
            ],
          });
      }
    }

    try {
      command.run(client, message, args, config, db);
    } catch (error) {
      console.error(error);
    }
  }
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
