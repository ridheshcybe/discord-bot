const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("youtube")
    .setDescription("returns first video by search")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("query of video to search")
        .setRequired(true)
    ),
  run: async (client, interaction, config, db) => {
    interaction.reply("Not implemented yet");
  },
};
