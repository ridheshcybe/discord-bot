const fs = require("fs");
const path = require("path");
const { Command } = require("reconlx");

const individual = {};
const all = "";

fs.readFileSync(path.resolve(__dirname, "./"))
  .filter((e) => e.endsWith(".js"))
  .forEach(({ name, description, category }) => {
    all += `\n${name} => ${description}`;
    individual[name] = `description => ${description}\ncategory => ${category}`;
  });

module.exports = new Command({
  //options
  name: "help",
  description: "Show Bot All Commands",
  userPermissions: ["SEND_MESSAGES"],
  category: "Information",
  // command start
  run: async ({ client, message, args }) => {
    if (args.length == 0) return message.reply(all);
    message.reply(individual[args[0]]);
  },
});
