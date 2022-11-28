const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "membercount",
  description: "gives the amount of users in the current guild",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_PERMISSIONS: "SendMessages",
  },
  run: async (client, interaction, config, db) => {
    console.log(interaction);
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            client.guilds.cache.get(interaction.guild.id).memberCount +
              " members"
          )
          .setColor("Blue"),
      ],
      ephemeral: true,
    });
  },
};
