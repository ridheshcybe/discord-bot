const fs = require("fs");
const chalk = require("chalk");
const { QuickDB } = require("quick.db");
const config = require("../config/config.js");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

const db = new QuickDB();

module.exports = (client) => {
  console.log(chalk.blue("Events Handler:"));
  client.on("ready", async () => {
    console.log(
      chalk.greenBright(`[READY] ${client.user.tag} is up and ready to go.`)
    );
  });

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = client.slash_commands.get(interaction.commandName);

      if (!command) return;

      try {
        command.run(client, interaction, config, db);
      } catch (e) {
        console.error(e);
      }
    }
  });

  client.on("messageCreate", async (message) => {
    if (message.channel.type !== 0) return;
    if (message.author.bot) return;

    const prefix = "!";

    if (!message.content.startsWith(prefix)) return;
    if (!message.guild) return;
    if (!message.member)
      message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length == 0) return;

    let command =
      client.prefix_commands.get(cmd) ||
      client.prefix_commands.get(client.aliases.get(cmd));

    if (!command) return;

    if (command) {
      if (command.permissions) {
        if (
          !message.member.permissions.has(
            PermissionsBitField.resolve(command.permissions || [])
          )
        )
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `🚫 Unfortunately, you are not authorized to use this command.`
                )
                .setColor("Red"),
            ],
          });
      }

      if ((command.owner, command.owner == true)) {
        if (config.Users?.OWNERS) {
          const allowedUsers = []; // New Array.

          config.Users.OWNERS.forEach((user) => {
            const fetchedUser = message.guild.members.cache.get(user);
            if (!fetchedUser) return allowedUsers.push("*Unknown User#0000*");
            allowedUsers.push(`${fetchedUser.user.tag}`);
          });

          if (!config.Users.OWNERS.some((ID) => message.member.id.includes(ID)))
            return message.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `🚫 Sorry but only owners can use this command! Allowed users:\n**${allowedUsers.join(
                      ", "
                    )}**`
                  )
                  .setColor("Red"),
              ],
            });
        }
      }

      try {
        command.run(client, message, args, prefix, config, db);
      } catch (error) {
        console.error(error);
      }
    }
  });
};
