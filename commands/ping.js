module.exports = {
  config: {
    name: "ping",
    description: "Replies with pong and websocket ping time",
  },
  permissions: ["SendMessages"],
  owner: false,
  run: async (client, message, args, config) => {
    client.createMessage(
      msg.channel.id,
      `🏓 **Pong!** Client websocket ping: \`${client.ws.ping || "null"}\` ms.`
    );
  },
};
