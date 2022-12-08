const fs = require("fs");
const chalk = require("chalk");
const { REST, Routes } = require("discord.js");

// Slash commands handler:

module.exports = (client, config) => {
  console.log(
    chalk.greenBright(`[READY] ${client.user.tag} is up and ready to go.`)
  );
  require("../handlers/slash")(client, config);
};
