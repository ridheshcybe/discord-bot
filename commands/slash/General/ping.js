const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  run: async (client, interaction, config, db) => {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(client.ws.ping + "ms!")
          .setColor("Blue"),
      ],
      ephemeral: true,
    });
  },
};
