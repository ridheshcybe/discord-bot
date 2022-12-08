const nodecache = require("node-cache");
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const cache = new nodecache({ stdTTL: 100, checkperiod: 120 });

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dictonary")
    .setDescription("returns information about a word")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .addStringOption((option) =>
      option.setName("query").setDescription("word to query").setRequired(true)
    ),
  run: async (client, interaction, config, db) => {
    const query = interaction.options.getString("query");

    if (cache.has(query))
      return interaction.reply({ embeds: [cache.get(query)] });

    try {
      const data = await (
        await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`)
      ).json();
      const embed = new EmbedBuilder().setTitle(`Dictionary - ${query}`);

      if (data.title && data.title == "No Definitions Found")
        return interaction.reply({
          embeds: [
            embed.setColor("Red").setDescription("No Definitions Found"),
          ],
        });

      embed.setColor("Green").setTimestamp(new Date()).setFooter({
        text: "bot-rw",
        iconURL: "https://cdn.discordapp.com/embed/avatars/0.png",
      });

      data[0].meanings.forEach((e, i, a) => {
        embed.addFields({
          name: e.partOfSpeech,
          value: e.definitions[0].definition,
        });
        if (a.length - 1 == i) {
          cache.set(query, embed);
          interaction.reply({
            embeds: [embed],
          });
        }
      });
    } catch (error) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Error => ${error.message || error}`),
        ],
      });
    }
  },
};
