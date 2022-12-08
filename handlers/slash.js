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
  // Registering all the application commands:
  if (!config.Client.ID) {
    console.log(
      chalk.red("[CRASH] You need to provide your bot ID in config.js!")
    );
    return process.exit();
  }

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  console.log(
    chalk.yellow(
      `[HANDLER] Started registering ${commands.length} application commands.`
    )
  );

  client.guilds.cache
    .map((guild) => guild.id)
    .forEach(async (e, i, a) => {
      try {
        let data = await rest.put(
          Routes.applicationGuildCommands(config.Client.ID, e),
          {
            body: commands,
          }
        );

        console.log(
          chalk.greenBright(
            `[HANDLER] Successfully registered ${data.length} application commands for ${e}`
          )
        );

        data = null;
      } catch (err) {
        console.log(err);
      }
      if (a.length - 1 == i) {
        console.log(
          chalk.greenBright(
            `[HANDLER] Successfully registered for all the application commands`
          )
        );
      }
    });
};
