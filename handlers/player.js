const { EventEmitter } = require("events");
const Youtube = require("youtube-sr").default;
const ytdl = require("ytdl-core-discord");
const move = (arr, old_index, new_index) => {
  while (old_index < 0) old_index += arr.length;
  while (new_index < 0) new_index += arr.length;
  if (new_index >= arr.length) {
    var k = new_index - arr.length;
    while (k-- + 1) arr.push(undefined);
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
};

class MusicPlayer extends EventEmitter {
  constructor(prefix) {
    if (!prefix) throw new Error("?");
    super();
    this.prefix = prefix;
    this.queue = new Map();
  }

  /**
   * Add music to queue
   * @param {import('discord.js').Message} message
   * @param {string} query
   */
  async add(message) {
    if (!message?.member?.voice?.channel)
      throw new Error("First, you should join to voice channel");
    if (!this.queue.has(message.guild.id)) this._initGuildQueue(message);

    const query = this._parseArgument(message.content).join(" ");
    const result = await Youtube.searchOne(query, "video");
    let queue = this.queue.get(message.guild.id);
    let item = {
      title: result.title,
      url: result.url,
      thumbnail_img: result.thumbnail.displayThumbnailURL(),
      length: result.durationFormatted,
    };

    queue.musics.push(item);

    this.emit("added", queue.textChannel, item);
  }

  /**
   * Play queue
   * @param {import('discord.js').Message} message
   */
  async play(message) {
    if (!message?.member?.voice?.channel)
      throw new Error("First, you should join to voice channel");
    if (!this.queue.has(message.guild.id)) throw new Error("Music not found");
    if (this.queue.get(message.guild.id).musics.length <= 0)
      throw new Error("Music not found");

    let queue = this.queue.get(message.guild.id);
    let connection = await message.member.voice.channel.join();
    let stream = await ytdl(queue.musics[0].url);
    let dispatcher = connection.play(stream, {
      volume: queue.volume / 100,
      type: "opus",
    });

    queue.voiceChannel = message.member.voice.channel;
    queue.textChannel = message.channel;
    queue.dispatcher = dispatcher;

    dispatcher.on("start", () =>
      this.emit("play", queue.textChannel, queue.musics[0])
    );

    dispatcher.on("finish", () => {
      this.emit("end", queue.textChannel);
      queue = this.queue.get(message.guild.id);
      if (queue.loop == true) queue.musics = move(queue.musics, 0, -1);
      else queue.musics.shift();
      if (!queue.musics[0]) this._destroyGuildQueue(message.guild.id);

      this.play(message);
    });
  }

  async stop(message) {
    message.guild.me.voice.channel.leave();
  }

  /**
   * Loop.
   * @param {import('discord.js').Message} message
   */
  async loop(message) {
    if (!message?.member?.voice?.channel)
      throw new Error("First, you should join to voice channel");
    if (!this.queue.has(message.guild.id)) this._initGuildQueue(message);

    let queue = this.queue.get(message.guild.id);

    if (queue.loop) {
      queue.loop = false;
      this.emit("loopEnabled", message.channel);
    } else {
      queue.loop = true;
      this.emit("loopDisabled", message.channel);
    }
  }

  /**
   * Set volume
   * @param {import('discord.js').Message} message
   */
  async volume(message) {
    if (!message?.member?.voice?.channel)
      throw new Error("First, you should join to voice channel");
    if (!this.queue.get(message.guild.id).dispatcher)
      throw new Error("Please play the music");

    const target = this._parseArgument(message.content)[0];

    if (!target) throw new Error("target volume not defined");
    if (isNaN(target)) throw new Error("target volume cannot be another type");

    let queue = this.queue.get(message.guild.id);
    queue.volume = target;
    queue.dispatcher.setVolume(queue.volume / 100);

    this.emit("volumeChanged", queue.textChannel, queue.volume);
  }

  _initGuildQueue(message) {
    this.queue.set(message.guild.id, {
      voiceChannel: message.member.voice.channel,
      textChannel: message.channel,
      musics: [],
      loop: false,
      volume: 50,
    });
  }

  _destroyGuildQueue(id) {
    this.emit("finish", this.queue.get(id).textChannel);
    this.queue.delete(id);
  }

  _parseArgument(content) {
    const args = content.slice(this.prefix.length).trim().split(/ +/g);
    args.shift();
    return args;
  }
}

module.exports = MusicPlayer;
