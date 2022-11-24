const fs = require("fs");
const { Client, Collection, MessageEmbed } = require("discord.js");

const client = new Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  shards: "auto",
  allowedMentions: {
    parse: ["roles", "users", "everyone"],
    repliedUser: true,
  },
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: 32767,
});

// Global Variables
client.cooldowns = new Collection();
client.commands = new Collection();
client.categories = fs.readdirSync("./commands/");

// Initializing the project
//Loading files, with the client variable like Command Handler, Event Handler, ...
["slash", "music"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
  console.log(`${client.user.username} Is Online`);
});

client.on("threadCreate", (thread) => {
  try {
    thread.join();
  } catch (e) {
    console.log(e.message);
  }
});

client.on("interactionCreate", async (interaction) => {
  // Slash Command Handling
  if (interaction.isCommand()) {
    await interaction.deferReply({ ephemeral: false }).catch(() => {});

    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return interaction.followUp({ content: "An error has occured " });

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }
    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );
    if (interaction.member.id === client.user.id) {
      interaction.followUp(`Its Me...`);
    }
    if (cmd) {
      // checking user perms
      if (!interaction.member.permissions.has(cmd.userPermissions || [])) {
        return interaction.followUp({
          embeds: [
            new MessageEmbed()
              .setColor("Red")
              .setDescription(
                `You don't Have ${cmd.userPermissions} To Run Command..`
              )
              .setFooter(
                "By ridhesh w | cybe",
                "https://img.icons8.com/color/452/discord-logo.png"
              ),
          ],
        });
      }
      cmd.run({ client, interaction, args });
    }
  }

  // Context Menu Handling
  if (interaction.isContextMenu()) {
    await interaction.deferReply({ ephemeral: false });
    const command = client.Commands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>)`);
  if (!prefixRegex.test(message.content)) return;
  const [, mPrefix] = message.content.match(prefixRegex);
  if (mPrefix.includes(client.user.id)) {
    message.reply({
      embeds: [
        new MessageEmbed()
          .setColor("Blue")
          .setFooter(
            "By ridhesh w | cybe",
            "https://img.icons8.com/color/452/discord-logo.png"
          )
          .setTitle(`**To See My All Commans Type **\`/help\``),
      ],
    });
  }
});

client.login(process.env.TOKEN);

process.on("unhandledRejection", (reason, p) => {
  console.log("[Error_Handling] :: Unhandled Rejection/Catch");
  console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log("[Error_Handling] :: Uncaught Exception/Catch");
  console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log("[Error_Handling] :: Uncaught Exception/Catch (MONITOR)");
  console.log(err, origin);
});

module.exports = client;


//staying alive
require("http").createServer((req,res)=>res.end("Ready.")).listen(8080)