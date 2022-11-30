const fs = require("fs");
const chalk = require("chalk");
const { PermissionsBitField, Routes, REST } = require("discord.js");

module.exports = (client, config) => {
  console.log(chalk.blue("Application commands Handler:"));

  let commands = [];

  // Slash commands handler:
  fs.readdirSync("./commands/slash/").forEach((dir) => {
    console.log(chalk.yellow("[!] Started loading slash commands..."));
    const SlashCommands = fs
      .readdirSync(`./commands/slash/${dir}`)
      .filter((file) => file.endsWith(".js"));

    for (let file of SlashCommands) {
      let pull = require(`../commands/slash/${dir}/${file}`);

      if ((pull.name, pull.description, pull.type == 1)) {
        client.slash_commands.set(pull.name, pull);
        console.log(
          chalk.greenBright(
            `[HANDLER - SLASH] Loaded a file: ${pull.name} (#${client.slash_commands.size})`
          )
        );

        commands.push(pull);
      } else {
        console.log(
          chalk.red(
            `[HANDLER - SLASH] Couldn't load the file ${file}, missing module name value, description, or type isn't 1.`
          )
        );
        continue;
      }
    }
  });

  // Registering all the application commands:
  if (!config.Client.ID) {
    console.log(
      "[CRASH] You need to provide your bot ID in config.js!".red + "\n"
    );
    return process.exit();
  }

  const rest = new REST({ version: "10" }).setToken(
    config.Client.TOKEN || process.env.TOKEN
  );

  (async () => {
    console.log(
      chalk.yellow(
        "[HANDLER] Started registering all the application commands."
      )
    );

    try {
      await rest.put(Routes.applicationCommands(config.Client.ID), {
        body: commands,
      });

      console.log(
        chalk.greenBright(
          "[HANDLER] Successfully registered all the application commands."
        )
      );
    } catch (err) {
      console.log(err);
    }
  })();
};
