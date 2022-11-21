const ytdl = require("ytdl-core");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "play",
    description: "Play your favorite songs",
  },
  permissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  owner: false,
  run: async (client, message, args, config, db) => {
    const serverQueue = db.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("You need to be in a voice channel to play music!")
            .setColor("Red"),
        ],
      });

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK"))
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              "I need the permissions to join and speak in your voice channel!"
            )
            .setColor("Red"),
        ],
      });

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
      };

      queue.set(message.guild.id, queueContruct);

      queueContruct.songs.push(song);

      try {
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;

        const serverQueue = queue.get(message.guild.id);
        if (!queueContruct.songs[0].song) {
          serverQueue.voiceChannel.leave();
          queue.delete(message.guild.id);
          return;
        }

        const dispatcher = serverQueue.connection
          .play(ytdl(queueContruct.songs[0].song.url))
          .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
          })
          .on("error", (error) => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(
          `Start playing: **${queueContruct.songs[0].song.title}**`
        );
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
  },
};
