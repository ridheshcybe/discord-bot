module.exports = {
  config: {
    name: "skip", // Name of Command
    description: "skips the current song", // Command Description
    usage: "skip", // Command usage
  },
  permissions: "", // User permissions needed
  owner: false, // Owner only?
  alias: [], // Command aliases
  run: async (client, message, args, prefix, config, db) => {
    client.distube.skip(message);
    return message.reply("Music skipped");
  },
};
