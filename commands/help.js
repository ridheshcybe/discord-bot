const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

let homedata = "";
const individualdescription = {};

fs.readdirSync(__dirname)
  .filter((e) => e.endsWith(".js"))
  .filter((e) => e !== "help.js")
  .forEach((file) => {
    const pull = require(path.resolve(__dirname, file));
    homedata += `\n\`${file.split(".")[0]}\` ► ${pull.description}`;
    individualdescription[file.split(".")[0]] = pull.description;
    console.log(
      `[help-command] loaded ${file.split(".")[0]} in the help command`
    );
  });

module.exports = {
  description: "help command",
  permissions: ["SendMessages"],
  owner: false,
  run: async (client, message, args, config) => {
    if (!args[0])
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Here is a list of all commands in me!\n To get detailed description on any specific command, do ${config.prefix}help <command>${homedata}`
            )
            .setColor("Green"),
        ],
      });

    const command = individualdescription[args[0]];

    if (!command)
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `I couldn't find a command called \`${args[0]}\` in the help command list!`
            )
            .setColor("Red"),
        ],
      });

    message.reply({
      embeds: [new EmbedBuilder().setDescription(command).setColor("Green")],
    });
  },
};
