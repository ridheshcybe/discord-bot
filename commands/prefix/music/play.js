const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "play",
    description: "Plays a song from spotify",
    usage: "play <URL / TITLE>",
  },
  permissions: ["SendMessages", "Connect"],
  owner: false,
  alias: ["p", "playsong", "playtrack"],
  run: async (client, message, args, prefix, config, db) => {
    try {
      const { channel } = message.member.voice;
      if (!channel)
        return message.channel.send(
          new EmbedBuilder()
            .setColor("Red")
            .setTitle(`❌ ERROR | Please join a Channel first`)
        );
      if (
        client.distube.getQueue(message) &&
        channel.id !== message.guild.me.voice.channel.id
      )
        return message.channel.send(
          new EmbedBuilder()
            .setColor("Red")
            .setTitle(`❌ ERROR | Please join **my** Channel first`)
            .setDescription(
              `Channelname: \`${message.guild.me.voice.channel.name}\``
            )
        );
      if (!args[0])
        return message.channel.send(
          new EmbedBuilder()
            .setColor("Red")
            .setTitle(`❌ ERROR | You didn't provided a Searchterm`)
            .setDescription(`Usage: \`${prefix}play <URL / TITLE>\``)
        );
      message.channel
        .send(
          new EmbedBuilder()
            .setColor("Green")
            .setTitle("Searching Song")
            .setDescription(`\`\`\`fix\n${text}\n\`\`\``)
        )
        .then((msg) =>
          msg.delete({ timeout: 3000 }).catch((e) => console.log(e.message))
        );
      if (
        args.join(" ").toLowerCase().includes("spotify") &&
        args.join(" ").toLowerCase().includes("track")
      ) {
        getPreview(args.join(" ")).then((result) => {
          client.distube.play(message, result.title);
        });
      } else if (
        args.join(" ").toLowerCase().includes("spotify") &&
        args.join(" ").toLowerCase().includes("playlist")
      ) {
        getTracks(args.join(" ")).then((result) => {
          for (const song of result) client.distube.play(message, song.name);
        });
      } else {
        client.distube.play(message, text);
      }
    } catch (e) {
      console.log(String(e.stack).bgRed);
      return message.channel.send(
        new EmbedBuilder()
          .setColor("Red")
          .setTitle(`❌ ERROR | An error occurred`)
          .setDescription(`\`\`\`${e.stack}\`\`\``)
      );
    }
  },
};
