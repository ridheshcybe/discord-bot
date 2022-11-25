const { Command } = require("reconlx");

module.exports = new Command({
  //options
  name: "help",
  description: "Show Bot All Commands",
  userPermissions: ["SEND_MESSAGES"],
  category: "Information",
  // command start
  run: async ({ client, message, args }) => {
    message.reply("Not implemented");
  },
});
