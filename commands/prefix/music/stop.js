const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "play",
    description: "play a song",
    usage: "play <title>",
  },
  permissions: ["SendMessages", "Connect"], // User permissions needed
  owner: false, // Owner only?
  alias: [], // Command aliases
  run: async (client, message, args, prefix, config, db) => {
    try {
      await client.stop(message);
      message.reply({
        embed: [new EmbedBuilder().setDescription("stopped").setColor("Green")],
      });
    } catch (err) {
      message.reply({
        embed: [
          new EmbedBuilder().setDescription(`Err => ${err}`).setColor("Red"),
        ],
      });
    }
  },
};
