const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("fetches a cat image from the server")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  run: async (client, interaction, config, db) => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("green")
          .setImage("https://api.thecatapi.com/v1/images/search"),
      ],
    });
  },
};
