const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("roll a dice")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .addNumberOption((opt) =>
      opt
        .setName("d")
        .setDescription("dice sides")
        .setMinValue(1)
        .setMaxValue(20)
    ),
  run: async (client, interaction, config, db) => {
    console.log(interaction.options.getNumber("d"));
    // execute
    interaction.reply("Testing in progress...");
  },
};
