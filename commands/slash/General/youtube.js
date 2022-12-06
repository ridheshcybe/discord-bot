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
    // const data = await pack(interaction.options);
    // interaction.reply(data[0].url);
    interaction.reply(interaction.options);
  },
};
