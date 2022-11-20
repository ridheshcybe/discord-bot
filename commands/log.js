const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "log",
    description: "loggging file for beta release",
  },
  permissions: ["SendMessages"],
  owner: true,
  run: async (client, message, args, config) => {
    console.log(message, args);
    message.reply(`arguments => ${args.length == 0 ? "No arguments" : args}`);
  },
};
