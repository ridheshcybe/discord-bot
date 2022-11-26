const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "", // Name of Command
    description: "", // Command Description
    usage: "", // Command usage
  },
  permissions: "", // User permissions needed
  owner: false, // Owner only?
  alias: [], // Command aliases
  run: async (client, message, args, prefix, config, db) => {
    // execute
  },
};

/* permissions => [
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
] */
