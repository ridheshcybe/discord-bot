const chalk = require("chalk");
module.exports = (client) => {
  console.log(chalk.blue("Events Handler:"));

  client.on("ready", () =>
    console.log(
      chalk.greenBright(`[READY] ${client.user.tag} is up and ready to go.`)
    )
  );
  client.on("interactionCreate", require("../events/interactionCreate"));
  client.on("messageCreate", require("../events/messageCreate"));
};
