const { Command } = require("reconlx");
const discord = require("discord.js");

module.exports = new Command({
  // options
  name: "invite",
  description: `Get Bot Invite Link`,
  userPermissions: ["SEND_MESSAGES"],
  category: "Information",
  // command start
  run: async ({ client, message, args }) => {
    message.reply(
      `>>> [Click to Invite](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`
    );
  },
});
