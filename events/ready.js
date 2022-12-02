module.exports = (client, config) => {
  console.log(
    chalk.greenBright(`[READY] ${client.user.tag} is up and ready to go.`)
  );
  const Guilds = client.guilds.cache.map((guild) => guild.id);
  console.log(Guilds);
};
