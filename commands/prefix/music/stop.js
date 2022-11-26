const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "stop",
    description: "stops playing song",
    usage: "stop",
  },
  permissions: ["Connect", "SendMessages"],
  owner: false,
  alias: ["s"],
  run: async (client, message, args, prefix, config, db) => {
    try {
      const { channel } = message.member.voice;
      if (!channel)
        return message.channel.send(
          new EmbedBuilder()
            .setColor("Red")

            .setTitle(`❌ ERROR | Please join a Channel first`)
        );
      if (!client.distube.getQueue(message))
        return message.channel.send(
          new EmbedBuilder()
            .setColor("Red")

            .setTitle(`❌ ERROR | I am not playing Something`)
            .setDescription(`The Queue is empty`)
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

      message.channel
        .send(
          new EmbedBuilder()
            .setColor("Green")

            .setTitle("⏹ Stopped playing Music and left your Channel")
        )
        .then((msg) =>
          msg.delete({ timeout: 4000 }).catch((e) => console.log(e.message))
        );

      client.distube.stop(message);
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
