import envConfig from "@/configs/env.config";
import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
  ],
});

client.login(envConfig.discord.botToken);
client.on("clientReady", () => {
  console.log(`Logged in as ${client.user?.tag}`);
});
client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;
  if (msg.content === "hello") {
    msg.reply("Hello, how can I help you today?");
  }
});
