const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("<NAME>")
    .setDescription("<DESCRIPTION>")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  run: async (client, interaction, config, db) => {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setDescription(Math.random() < 0.5 ? "Heads" : "Tails"),
      ],
    });
  },
};
