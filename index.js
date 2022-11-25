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
client.commands = new Collection();

// slash handler
fs.readdirSync("./commands").forEach((cmd) => {
  fs.readdirSync(`./commands/${cmd}/`)
    .filter((file) => file.endsWith(".js"))
    .forEach((cmds) => {
      let pull = require(`./commands/${cmd}/${cmds}`);

      if (!pull.name || !pull.run)
        return console.log(`${cmds} Command is not Ready`);

      client.commands.set(pull.name, pull);

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

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!") || message.author.bot) return;
  if (message.channel.type === "dm") return;
  const args = message.content.slice("!".length).split(" ");

  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.get(
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      )
    );
  if (!command) return;

  try {
    command.run({ client, interaction, args });
  } catch (e) {
    message.channel
      .send(`Utilize \`!help\` err=>${e}`)
      .then((message) => setTimeout(() => message.delete(), 10000));
  }
});

client.login(process.env.TOKEN);

module.exports = client;

//staying alive
require("http")
  .createServer((req, res) => res.end("Ready."))
  .listen(8080);
