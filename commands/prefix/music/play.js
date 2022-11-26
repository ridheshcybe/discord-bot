const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "play",
    description: "Plays a song from spotify",
    usage: "play <URL / TITLE>",
  },
  permissions: ["SendMessages"],
  owner: false,
  alias: ["p", "playsong", "playtrack"],
  run: async (client, message, args, prefix, config, db) => {
    distube.play(message, args.join(" "));
  },
};
