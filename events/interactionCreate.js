const path = require("path");
const config = require("../config/config");
const Datastore = require("@seald-io/nedb");
const { EmbedBuilder } = require("discord.js");

const db = new Datastore({
  filename: path.resolve(__dirname, "../.db/main.db"),
  autoload: true,
});

module.exports = async (interaction, client) => {
  if (interaction.isChatInputCommand()) {
    const command = client.slash_commands.get(interaction.commandName);

    if (!command) return;
    if (!interaction.guildId)
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setDescription("Not in a guild").setColor("Red"),
        ],
        ephemeral: true,
      });

    try {
      command.run(client, interaction, config, db);
    } catch (e) {
      console.error(e);
    }
  }
};
