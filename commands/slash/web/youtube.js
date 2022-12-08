const YouTube = require("youtube-node");
const nodecache = require("node-cache");
const { SlashCommandBuilder } = require("discord.js");

const youTube = new YouTube();
const cache = new nodecache({ stdTTL: 100, checkperiod: 120 });

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
    const query = interaction.options.getString("query");
    if (!cache.has(query))
      return youTube.search(query, 1, (error, result) => {
        const reply = error
          ? JSON.stringify(error)
          : `https://youtube.com/watch?v=${result.items[0].id.videoId}`;
        cache.set(query, reply);
        interaction.reply(reply);
      });
    interaction.reply(cache.get(query));
  },
};
