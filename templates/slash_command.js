const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("<NAME>")
    .setDescription("<DESCRIPTION>")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  run: async (client, interaction, config, db) => {
    // execute
  },
};

/*
commands available to SlashCommandBuilder
  'addBooleanOption',
  'addUserOption',
  'addChannelOption',
  'addRoleOption',
  'addAttachmentOption',
  'addMentionableOption',
  'addStringOption',
  'addIntegerOption',
  'addNumberOption',
  'setName',
  'setDescription',
  'setNameLocalization',
  'setNameLocalizations',
  'setDescriptionLocalization',
  'setDescriptionLocalizations',
  'setDefaultPermission',
  'setDefaultMemberPermissions',
  'setDMPermission',
  'addSubcommandGroup',
  'addSubcommand',
*/

/*
permissions: 
  'CreateInstantInvite',
  'KickMembers',
  'BanMembers',
  'Administrator',
  'ManageChannels',
  'ManageGuild',
  'AddReactions',
  'ViewAuditLog',
  'PrioritySpeaker',
  'Stream',
  'ViewChannel',
  'SendMessages',
  'SendTTSMessages',
  'ManageMessages',
  'EmbedLinks',
  'AttachFiles',
  'ReadMessageHistory',
  'MentionEveryone',
  'UseExternalEmojis',
  'ViewGuildInsights',
  'Connect',
  'Speak',
  'MuteMembers',
  'DeafenMembers',
  'MoveMembers',
  'UseVAD',
  'ChangeNickname',
  'ManageNicknames',
  'ManageRoles',
  'ManageWebhooks',
  'ManageEmojisAndStickers',
  'UseApplicationCommands',
  'RequestToSpeak',
  'ManageEvents',
  'ManageThreads',
  'CreatePublicThreads',
  'CreatePrivateThreads',
  'UseExternalStickers',
  'SendMessagesInThreads',
  'UseEmbeddedActivities',
  'ModerateMembers'
  */
