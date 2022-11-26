const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "skip", // Name of Command
    description: "skips the current song", // Command Description
    usage: "skip", // Command usage
  },
  permissions: "", // User permissions needed
  owner: false, // Owner only?
  alias: ["SendMessages", "Connect"], // Command aliases
  run: async (client, message, args, prefix, config, db) => {
    try {
      const { channel } = message.member.voice;
      if (!channel)
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")

              .setTitle(`❌ ERROR | Please join a Channel first`),
          ],
        });
      if (!client.distube.getQueue(message))
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")

              .setTitle(`❌ ERROR | I am not playing Something`)
              .setDescription(`The Queue is empty`),
          ],
        });
      if (
        client.distube.getQueue(message) &&
        channel.id !== message.guild.me.voice.channel.id
      )
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")

              .setTitle(`❌ ERROR | Please join **my** Channel first`)
              .setDescription(
                `Channelname: \`${message.guild.me.voice.channel.name}\``
              ),
          ],
        });

      message.channel
        .send(
          new EmbedBuilder()
            .setColor("Green")

            .setTitle("⏭ Skipped the Current Track")
        )
        .then((msg) =>
          msg.delete({ timeout: 4000 }).catch((e) => console.log(e.message))
        );

      client.distube.skip(message);
    } catch (e) {
      console.log(String(e.stack).bgRed);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")

            .setTitle(`❌ ERROR | An error occurred`)
            .setDescription(`\`\`\`${e.stack}\`\`\``),
        ],
      });
    }
  },
};
