const http = require("http");
const discord = require("discord.js");
const config = require("./config/config");

// Creating a new client:
const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.GuildPresences,
    discord.GatewayIntentBits.GuildMessageReactions,
    discord.GatewayIntentBits.DirectMessages,
    discord.GatewayIntentBits.MessageContent,
  ],
  partials: [
    discord.Partials.Channel,
    discord.Partials.Message,
    discord.Partials.User,
    discord.Partials.GuildMember,
    discord.Partials.Reaction,
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

client.prefix_commands = new discord.Collecton();

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

    client.prefix_commands.set(pull.config.name, pull);
    console.log(
      `[prefix] Loaded a file: ${pull.config.name} (#${client.prefix_commands.size})`
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

  let command = client.prefix_commands.get(cmd);

  if (!command) return;

  if (command) {
    if (command.permissions) {
      if (
        !message.member.permissions.has(
          PermissionsBitField.resolve(command.permissions || [])
        )
      )
        return message.reply({
          embeds: [
            new EmbedBuilder()
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
              new EmbedBuilder()
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
      command.run(client, message, args, config);
    } catch (error) {
      console.error(error);
    }
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
