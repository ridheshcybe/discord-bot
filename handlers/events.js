const chalk = require("chalk");
module.exports = (client) => {
  console.log(chalk.blue("Events Handler:"));

  client.on("ready", () =>
    require("../events/ready")(client, require("../config/config"))
  );
  client.on("interactionCreate", (i) =>
    require("../events/interactionCreate")(i, client)
  );
  client.on("messageCreate", (i) =>
    require("../events/messageCreate")(i, client)
  );
};
