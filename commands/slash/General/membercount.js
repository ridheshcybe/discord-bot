const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "membercount",
  description: "amount of members in a guild",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages",
  },
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
