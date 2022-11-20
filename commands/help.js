const fs = require("fs");

const data = {};

fs.readdirSync("./")
  .filter((e) => e.endsWith(".js"))
  .forEach((file) => {
    const pull = require(`./${file}`);
    data[pull.config.name] = pull.config.description;
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
              `**help**
            `
            )
            .setColor("Green"),
        ],
      });
  },
};
