const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "clear",
    description: "clear messages in a channel",
    usage: "clear <number of messages to clear>",
  },
  permissions: ["Administrator"],
  owner: false,
  alias: [],
  run: async (client, message, args, prefix, config, db) => {
    message.delete();
    const fetched = await message.channel.fetchMessages({
      limit: args[0] || 1,
    });
    message.channel.bulkDelete(fetched);
  },
};
