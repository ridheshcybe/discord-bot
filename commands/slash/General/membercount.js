const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("memebercount")
    .setDescription("amount of members in a guild")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  run: async (client, interaction, config, db) => {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `${
              client.guilds.cache.get(interaction.guild.id).memberCount - 1
            } members`
          )
          .setColor("Blue"),
      ],
      ephemeral: true,
    });
  },
};
