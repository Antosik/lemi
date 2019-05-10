import * as dotenv from "dotenv";
import Lemi from "./bot";

dotenv.config();

const client = new Lemi({
  discord_token: process.env.DISCORD_TOKEN,
  prefix: process.env.LEMI_PREFIX
});

client.run();
