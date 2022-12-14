const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("fetches a cat image from the server")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  run: async (client, interaction, config, db) => {
    const res = await fetch("https://api.thecatapi.com/v1/images/search", {
      "X-API-KEY": process.env.CAT_TOKEN,
    });
    const body = await res.json();
    interaction.reply({
      embeds: [new EmbedBuilder().setColor("Green").setImage(body[0].url)],
    });
  },
};
