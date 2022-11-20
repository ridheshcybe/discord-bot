const fs = require("fs");
const path = require("path");

const data = "";

fs.readdirSync(__dirname)
  .filter((e) => e.endsWith(".js"))
  .filter((e) => e !== "help.js")
  .forEach((file) => {
    const pull = require(path.resolve(__dirname, file));
    console.log(file, pull);
    data += `\n${pull.config.name} ► ${pull.config.description}`;
    console.log(`loaded ${pull.config.name} in the help command`);
  });

module.exports = {
  config: {
    name: "help",
    description: "help command",
  },
  permissions: ["SendMessages"],
  owner: false,
  run: async (client, message, args, config) => {
    if (!args[0])
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `hello ${message.author.name}! Here is a list of all commands in me! To get detailed description on any specific command, do ${config.prefix}help <command>${data}`
            )
            .setColor("Green"),
        ],
      });
  },
};
