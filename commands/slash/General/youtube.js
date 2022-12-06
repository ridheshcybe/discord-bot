const YouTube = require("youtube-sr").default;
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
    const videos = await YouTube.search(
      interaction.options._hoistedOptions[0].value,
      { limit: 1, safeSearch: true }
    );
    console.log(videos);
    interaction.reply("N.I");
  },
};
