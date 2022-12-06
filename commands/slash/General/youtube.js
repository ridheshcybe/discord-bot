const YouTube = require("youtube-node");
const { SlashCommandBuilder } = require("discord.js");
const youTube = new YouTube();

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
    youTube.setKey(process.env.YOUTUBE_TOKEN);

    youTube.search(
      interaction.options._hoistedOptions[0].value,
      1,
      (error, result) => {
        if (error) return console.log(error);
        console.log(JSON.stringify(result, null, 2));
      }
    );
    interaction.reply("N.I");
  },
};
