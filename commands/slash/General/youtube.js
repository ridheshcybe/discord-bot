const { SlashCommandBuilder } = require("discord.js");
const pack = require("../../../packages/youtube");

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
    const data = await pack();
    interaction.reply(data[0].url);
  },
};
