const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "ping",
    description: "Replies with pong and websocket ping time",
  },
  permissions: ["SendMessages"],
  owner: false,
  run: async (client, message, args, config) => {
    message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `🏓 **Pong!** Client websocket ping: \`${client.ws.ping}\` ms.`
          )
          .setColor("Green"),
      ],
    });
  },
};
