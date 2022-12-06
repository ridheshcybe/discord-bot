const YouTube = require("youtube-node");
const { SlashCommandBuilder } = require("discord.js");
const youTube = new YouTube();

youTube.setKey(process.env.YOUTUBE_TOKEN);

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
    youTube.search(
      interaction.options.getString("query"),
      1,
      (error, result) => {
        if (error) return interaction.reply(JSON.stringify(error));
        interaction.reply(
          `https://youtube.com/watch?v=${result.items[0].id.videoId}`
        );
      }
    );
  },
};
