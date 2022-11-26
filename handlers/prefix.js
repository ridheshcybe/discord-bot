const fs = require("fs");
const chalk = require("chalk");

module.exports = (client, config) => {
  console.log(chalk.blue("Prefix Handler:"));

  fs.readdirSync("./commands/prefix/").forEach((dir) => {
    const commands = fs
      .readdirSync(`./commands/prefix/${dir}`)
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        let pull = require(`../commands/prefix/${dir}/${file}`);
        if (!pull.config.name)
          return console.log(
            chalk.red(
              `[HANDLER - PREFIX] Couldn't load the file ${file}, missing module name value.`
            )
          );
        client.prefix_commands.set(pull.config.name, pull);
        if (pull.aliases && Array.isArray(pull.aliases))
          pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
        console.log(
          chalk.greenBright(
            `[HANDLER - PREFIX] Loaded a file: ${pull.config.name} (#${client.prefix_commands.size})`
          )
        );
      });
  });
};
