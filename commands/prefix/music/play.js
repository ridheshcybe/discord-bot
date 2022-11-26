const { EmbedBuilder } = require("discord.js");
const music = require("@koenie06/discord.js-music");

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
      const text = args.join(" ");
      if (!channel)
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle(`❌ ERROR | Please join a Channel first`),
          ],
        });
      if (channel.id !== message.guild.me.voice.channel.id)
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
      if (!text)
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setTitle(`❌ ERROR | You didn't provided a Searchterm`)
              .setDescription(`Usage: \`${prefix}play <URL / TITLE>\``),
          ],
        });
      message
        .reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setTitle("Searching Song")
              .setDescription(`\`\`\`fix\n${text}\n\`\`\``),
          ],
        })
        .then((msg) =>
          msg.delete({ timeout: 5000 }).catch((e) => console.log(e.message))
        );

      music.play({
        interaction: interaction,
        channel: channel,
        song: text,
      });
    } catch (e) {
      console.log(String(e.stack));
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
