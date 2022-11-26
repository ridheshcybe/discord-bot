const fs = require("fs");
const chalk = require("chalk");
const { PermissionsBitField, Routes, REST, User } = require("discord.js");

module.exports = (client, config) => {
  console.log("Application commands Handler:".blue);

  let commands = [];

  // Slash commands handler:
  fs.readdirSync("./commands/slash/").forEach((dir) => {
    console.log("[!] Started loading slash commands...".yellow);
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

        commands.push({
          name: pull.name,
          description: pull.description,
          type: pull.type || 1,
          options: pull.options ? pull.options : null,
          default_permission: pull.permissions.DEFAULT_PERMISSIONS
            ? pull.permissions.DEFAULT_PERMISSIONS
            : null,
          default_member_permissions: pull.permissions
            .DEFAULT_MEMBER_PERMISSIONS
            ? PermissionsBitField.resolve(
                pull.permissions.DEFAULT_MEMBER_PERMISSIONS
              ).toString()
            : null,
        });
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
      "[HANDLER] Started registering all the application commands.".yellow
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
