import Lemi from "./bot";

require("dotenv").config();

const client = new Lemi({
  lol_token: process.env.LOL_TOKEN,
  discord_token: process.env.DISCORD_TOKEN,
  prefix: process.env.LEMI_PREFIX
});

client.run();