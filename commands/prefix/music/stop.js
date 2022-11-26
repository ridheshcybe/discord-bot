const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "",
    description: "",
    usage: "",
  },
  permissions: "",
  owner: false,
  alias: ["s"],
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
    if (!message.guild.me.voice.channel)
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              ":notes: **The player has stopped and the queue has been cleared.**"
            )
            .setColor("Green"),
        ],
      });
    if (
      message.guild.me.voice?.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `:no_entry_sign: You must be listening in **${message.guild.me.voice.channel.name}** to use that!`
            )
            .setColor("Green"),
        ],
      });
    const queue = client.player.getQueue(message.guild.id);

    queue.stop();

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            ":notes: **The player has stopped and the queue has been cleared.**"
          )
          .setColor("Green"),
      ],
    });
  },
};
