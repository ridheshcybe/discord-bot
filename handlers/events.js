const chalk = require("chalk");
module.exports = (client) => {
  console.log(chalk.blue("Events Handler:"));

  client.on("ready", () =>
    console.log(
      chalk.greenBright(`[READY] ${client.user.tag} is up and ready to go.`)
    )
  );
  client.on("interactionCreate", (i) =>
    require("../events/interactionCreate")(i, client)
  );
  client.on("messageCreate", (i) =>
    require("../events/messageCreate")(i, client)
  );
};
