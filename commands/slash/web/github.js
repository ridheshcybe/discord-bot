const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("github")
    .setDescription("gets github information")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription(
          "username of the github account you want to get information about"
        )
        .setRequired(true)
    ),
  run: async (client, interaction, config, db) => {
    const username = interaction.options.getString("username");
    const fetched = await fetch("https://api.github.com/users/" + username, {
      headers: {
        "User-Agent": "User-" + username,
      },
    });
    const body = await fetched.json();

    if (body.message && body.message == "Not Found")
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setColor("Red").setDescription("User not found"),
        ],
      });

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTitle(`Github - ${body.name}`)
          .setFields(
            { name: "followers", value: body.followers || 0 },
            { name: "public repos", value: body.public_repos || 0 },
            { name: "following", value: body.following || 0 },
            { name: "bio", value: body.bio || "None" },
            { name: "blog", value: body.blog || "None" },
            { name: "location", value: body.location || "None" }
          ),
      ],
    });
  },
};
