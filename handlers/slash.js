const fs = require("fs");
const chalk = require("chalk");

module.exports = (client, config) => {
  let commands = [];
  console.log(chalk.yellow("[!] Started loading slash commands..."));
  fs.readdirSync("./commands/slash/").forEach((dir) => {
    console.log(chalk.greenBright(`[HANDLER - SLASH] loading ${dir}`));
    const SlashCommands = fs
      .readdirSync(`./commands/slash/${dir}`)
      .filter((file) => file.endsWith(".js"));

    for (let file of SlashCommands) {
      let pull = require(`../commands/slash/${dir}/${file}`);

      client.slash_commands.set(pull.data.name, pull);
      console.log(
        chalk.greenBright(
          `[HANDLER - SLASH] Loaded a file: ${pull.data.name} (#${client.slash_commands.size})`
        )
      );

      commands.push(pull.data.toJSON());
    }
  });

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  console.log(
    chalk.yellow(
      `[HANDLER] Started registering ${commands.length} application commands.`
    )
  );

  rest
    .put(Routes.applicationCommands("1042689066304557067"), {
      body: commands,
    })
    .then((data) => {
      console.log(
        chalk.greenBright(
          `[HANDLER] Successfully registered ${data.length} application commands for ${e}`
        )
      );
      data = null;
    })
    .catch((err) => console.error(err));
};
