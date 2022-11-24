const { Command } = require("reconlx");
const { MessageEmbed } = require("discord.js");

module.exports = new Command({
  //options
  name: "help",
  description: "Show Bot All Commands",
  userPermissions: ["SEND_MESSAGES"],
  category: "Information",
  // command start
  run: async ({ client, interaction, args }) => {
    try {
      if (args[0]) {
        const embed = new MessageEmbed();
        const cmd = client.commands.get(args[0].toLowerCase());
        if (!cmd) {
          return interaction.followUp({
            embeds: [
              embed
                .setColor("Red")
                .setDescription(
                  `No Information found for command **${args[0].toLowerCase()}**`
                ),
            ],
          });
        }
        if (cmd.name) embed.addField("**Command name**", `\`${cmd.name}\``);
        if (cmd.name)
          embed.setTitle(`Detailed Information about:\`${cmd.name}\``);
        if (cmd.description)
          embed.addField("**Description**", `\`${cmd.description}\``);
        if (cmd.usage) {
          embed.addField("**Usage**", `\`${prefix}${cmd.usage}\``);
          embed.setFooter("Syntax: <> = required, [] = optional");
        }
        return interaction.followUp({
          embeds: [embed.setColor(ee.embed_color)],
        });
      } else {
        let homeEmbed = new MessageEmbed()
          .setColor(ee.embed_color)
          .setTitle(`🔰 My All Slash Commands`)
          .addField("Developer", `Name :- <@827582516445184020>`)
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setFooter(
            "By ridhesh w | cybe",
            "https://img.icons8.com/color/452/discord-logo.png"
          );

        const commands = (category) => {
          return client.commands
            .filter((cmd) => cmd.category === category)
            .map((cmd) => `\`${cmd.name}\``);
        };
        try {
          const catagories = fs.readdirSync("./commands/");
          for (let i = 0; i < catagories.length; i += 1) {
            const current = catagories[i];
            const items = commands(current);
            homeEmbed.addField(
              `**${current.toUpperCase()} [${items.length}]**`,
              `> ${items.join(", ")}`
            );
          }
        } catch (e) {
          console.log(e);
        }
        interaction.followUp({ embeds: [homeEmbed], ephemeral: true });
      }
    } catch (e) {
      console.log(e);
    }
  },
});
