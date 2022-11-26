const client = require("../../index");
const chalk = require("chalk");

module.exports = {
  name: "ready.js",
};

client.on("ready", async () => {
  console.log(
    "\n" +
      chalk.greenBright(`[READY] ${client.user.tag} is up and ready to go.`)
  );
});
