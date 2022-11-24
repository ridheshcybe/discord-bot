const {
  Client,
  Collection,
  MessageEmbed,
  GatewayIntentBits,
} = require("discord.js");
const fs = require("fs");
const Distube = require("distube").default;
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

// Global Variables
client.commands = {};

// slash handler
fs.readdirSync("./commands").forEach((cmd) => {
  fs.readdirSync(`./commands/${cmd}/`)
    .filter((file) => file.endsWith(".js"))
    .forEach((cmds) => {
      let pull = require(`../commands/${cmd}/${cmds}`);

      if (!pull.name || !pull.run)
        return console.log(`${cmds} Command is not Ready`);

      client.commands[pull.name] = pull;

      if (pull.aliases && Array.isArray(pull.aliases))
        pull.aliases.forEach((alias) => client.aliases.set(alias, name));

      console.log(`loaded ${pull.name}`);
    });
});

//music handler
let distube = new Distube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true,
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin(),
  ],
});

distube
  .on("playSong", (queue, song) => {
    queue.textChannel.send(
      `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
    );
  })
  .on("addSong", (queue, song) => {
    queue.textChannel.send(
      `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}.`
    );
  })
  .on("addList", (queue, playlist) => {
    queue.textChannel.send(
      `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to the queue!`
    );
  })
  .on("disconnect", (queue) => {
    queue.textChannel.send(`Song Ended`);
  })
  .on("initQueue", (queue) => {
    queue.autoplay = false;
    queue.volume = 100;
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

    const cmd = client.commands[interaction.commandName];
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
    const command = client.commands[interaction.commandName];
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

module.exports = client;

//staying alive
require("http")
  .createServer((req, res) => res.end("Ready."))
  .listen(8080);
