const path = require("path");
const config = require("../config/config");
const Datastore = require("@seald-io/nedb");

const db = new Datastore({
  filename: path.resolve(__dirname, "../.db/main.db"),
  autoload: true,
});

module.exports = async (interaction, client) => {
  if (interaction.isChatInputCommand()) {
    const command = client.slash_commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.run(client, interaction, config, db);
    } catch (e) {
      console.error(e);
    }
  }
};
