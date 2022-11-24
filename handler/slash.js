const fs = require("fs");

module.exports = (client) => {
  try {
    let command = 0;
    const arrayOfCommands = [];
    fs.readdirSync("./commands").forEach((cmd) => {
      fs.readdirSync(`./commands/${cmd}/`)
        .filter((file) => file.endsWith(".js"))
        .forEach((cmds) => {
          let pull = require(`../commands/${cmd}/${cmds}`);
          const name = cmds.split(".")[0];
          if (!name) return console.log(`${cmds} Command is not Ready`);
          client.commands.set(name, pull);
          arrayOfCommands.push(pull);
          command++;
          if (pull.aliases && Array.isArray(pull.aliases))
            pull.aliases.forEach((alias) => client.aliases.set(alias, name));
        });
      client.on("ready", async () => {
        client.guilds.cache.forEach(async (g) => {
          await client.guilds.cache.get(g.id).commands.set(arrayOfCommands);
        });
      });
    });
    console.log(`${command} sls lOADED`);
  } catch (e) {
    console.log(e.message);
  }
};
