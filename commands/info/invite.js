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
    let embed = new discord.MessageEmbed()
      .setColor("Green")
      .setTitle(`Thanks For Inviting Me.`)
      .setDescription(
        `>>> [Click to Invite](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`
      )
      .setFooter(
        "By ridhesh w | cybe",
        "https://img.icons8.com/color/452/discord-logo.png"
      );
    message.reply({ embeds: [embed] });
  },
});
