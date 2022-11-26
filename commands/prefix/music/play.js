const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "play",
    description: "Plays a song from spotify",
    usage: "play <URL/title>",
  },
  permissions: ["SendMessages", "Connect"],
  owner: false,
  alias: ["p", "playsong", "playtrack"],
  run: async (client, message, args, prefix, config, db) => {
    if (!message.member.voice.channel)
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              ":no_entry_sign: **You must join a voice channel to use that!**"
            )
            .setColor("Red"),
        ],
      });
    if (
      message.guild.me.voice &&
      message.guild.me.voice?.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `:no_entry_sign: You must be listening in **${message.guild.me.voice.channel.name}** to use that!`
            )
            .setColor("Red"),
        ],
      });
    const songTitle = args.slice(0).join(" ");

    const queue = await client.player.createQueue(message.guild, {
      leaveOnEnd: false,
      leaveOnStop: true,
      channelEmpty: true,
      metadata: {
        channel: message.channel,
        voice: message.member.voice.channel,
      },
    });
    try {
      if (!queue.connection) await queue.connect(message.member.voice.channel);
    } catch {
      queue.destroy();
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("**Couldn't join your voice channel!**")
            .setColor("Green"),
        ],
      });
    }
    if (!songTitle)
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `:no_entry_sign: **You should type song name or url.**`
            )
            .setColor("Green"),
        ],
      });
    message
      .reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`:watch: Searching ... (\`${songTitle}\`)`)
            .setColor("Green"),
        ],
      })
      .then(async (m) => {
        const searchResult = await client.player.search(songTitle, {
          requestedBy: message.author,
          searchEngine: QueryType.AUTO,
        });
        if (!searchResult.tracks.length)
          return m.edit({ content: `**:mag: Not found.**` });
        m.edit({
          content: `:notes: **${searchResult.tracks[0].title}** Added to **Queue** (${searchResult.tracks[0].duration})!`,
          ephemeral: true,
        });
        searchResult.playlist
          ? queue.addTracks(searchResult.tracks)
          : queue.addTrack(searchResult.tracks[0]);

        if (!queue.playing) await queue.play();
      });
  },
};
