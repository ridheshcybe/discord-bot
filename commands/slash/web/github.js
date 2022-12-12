const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("github")
    .setDescription("gets github information")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  run: async (client, interaction, config, db) => {
    interaction.reply("Not Implemened");
  },
};
