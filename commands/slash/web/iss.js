const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("iss")
    .setDescription("displays info about the international space station")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  run: async (client, interaction, config, db) => {
    const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
    const body = await res.json();

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("ISS Info")
          .setColor("Green")
          .setFields(
            { name: "altitude", value: body.altitude },
            { name: "longitude", value: body.longitude },
            { name: "latitude", value: body.latitude }
          ),
      ],
    });
  },
};
