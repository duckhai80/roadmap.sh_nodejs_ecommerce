import envConfig from "@/configs/env.config";
import {
  BaseMessageOptions,
  Client,
  GatewayIntentBits,
  TextChannel,
} from "discord.js";

const DISCORD_BOT_TOKEN = envConfig.discord.botToken;
const DISCORD_CHANNEL_ID = envConfig.discord.channelId;

class DiscordLoggerService {
  private client: Client;
  private channelId: string;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.channelId = DISCORD_CHANNEL_ID!;

    this.client.on("clientReady", () => {
      console.log(`Logged in as ${this.client.user?.tag}`);
    });
    this.client.login(DISCORD_BOT_TOKEN);
  }

  send(message: BaseMessageOptions) {
    const channel = this.client.channels.cache.get(
      this.channelId,
    ) as TextChannel;

    if (!channel) {
      console.error("Could not find channel", this.channelId);
      return;
    }

    channel.send(message).catch((error) => console.error(error));
  }

  sendFormatCode(logData: { code: string; message?: string; title?: string }) {
    const {
      code,
      message = "This is some additional information about the code.",
      title = "Code example",
    } = logData;
    const codeMessage: BaseMessageOptions = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16),
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };

    this.send(codeMessage);
  }
}

export default new DiscordLoggerService();
