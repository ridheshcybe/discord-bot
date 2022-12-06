const youtubeSuggest = require("youtube-suggest");
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
    const data = await youtubeSuggest(
      interaction.options._hoistedOptions[0].value
    );
    console.log(data);
    interaction.reply("N.I");
  },
};
