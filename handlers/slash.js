const fs = require("fs");

module.exports = (client) => {
    const arrayOfCommands = [];
    fs.readdirSync("./commands").forEach((cmd) => {
      fs.readdirSync(`./commands/${cmd}/`)
        .filter((file) => file.endsWith(".js"))
        .forEach((cmds) => {
          let pull = require(`../commands/${cmd}/${cmds}`);
          if (!pull.name) return console.log(`${cmds} Command is not Ready`);
          client.commands.set(pull.name, pull);
          arrayOfCommands.push(pull);
            console.log(`loaded ${pull.name}`);
          if (pull.aliases && Array.isArray(pull.aliases))
            pull.aliases.forEach((alias) => client.aliases.set(alias, name));
        });
      client.on("ready", async () => {
        client.guilds.cache.forEach(async (g) => {
          await client.guilds.cache.get(g.id).commands.set(arrayOfCommands);
        });
      });
    });
};
