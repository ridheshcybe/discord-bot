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
    const limit = args[0] || 1;
    const fetched = await message.channel.messages.fetch({
      limit,
    });
    message.channel.bulkDelete(fetched);
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `successfully deleted ${limit} messages form ${message.channel.id}`
          )
          .setColor("Green"),
      ],
    });
  },
};
