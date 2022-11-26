module.exports = {
  config: {
    name: "stop", // Name of Command
    description: "stops playing song", // Command Description
    usage: "stop", // Command usage
  },
  permissions: "", // User permissions needed
  owner: false, // Owner only?
  alias: [], // Command aliases
  run: async (client, message, args, prefix, config, db) => {
    client.distube.stop(message);
    return message.reply("Music stopped");
  },
};
