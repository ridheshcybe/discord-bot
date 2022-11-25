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
    message.reply(`Ping :- ${client.ws.ping}ms`);
  },
});
