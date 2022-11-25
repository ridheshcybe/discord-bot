const { Command } = require("reconlx");
const discord = require("discord.js");

module.exports = new Command({
  // options
  name: "ping",
  description: `Show Bot Ping`,
  userPermissions: ["SEND_MESSAGES"],
  category: "Information",
  // command start
  run: async ({ client, message, args }) => {
    message.reply({
      embeds: [
        new discord.MessageEmbed()
          .setColor("Green")
          .setTitle(`Ping :- ${client.ws.ping}`)
          .setFooter(
            "By ridhesh w | cybe",
            "https://img.icons8.com/color/452/discord-logo.png"
          ),
      ],
    });
  },
});
