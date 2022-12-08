const got = require("got");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disctonary")
    .setDescription("returns information about a word")
    .addStringOption((option) =>
      option.setName("query").setDescription("word to query").setRequired(true)
    ),
  run: async (client, interaction, config, db) => {
    const query = interaction.options.getString("query");

    try {
      const data = await got.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${query}`
      );
      const embed = new EmbedBuilder().setTitle(`Dictionary - ${query}`);

      if (data.title && data.title == "No Definitions Found")
        return message.reply({
          embeds: [
            embed.setColor("Red").setDescription("No Definitions Found"),
          ],
        });

      embed.setColor("Green").setTimestamp(new Date()).setFooter({
        text: "bot-rw",
        iconURL: "https://cdn.discordapp.com/embed/avatars/0.png",
      });

      JSON.parse(data).body[0].meanings.forEach((e, i, a) => {
        embed.addFields({
          name: e.partOfSpeech,
          value: e.definitions[0].definition,
        });
        if (a.length - 1 == i)
          message.reply({
            embeds: [embed],
          });
      });
    } catch (error) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("red")
            .setDescription(`Error => ${error.message || error}`),
        ],
      });
    }
  },
};
