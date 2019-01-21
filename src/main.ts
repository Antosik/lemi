import Lemi from "./bot";

require("dotenv").config();

const client = new Lemi({
  lol_token: process.env.LOL_TOKEN,
  discord_token: process.env.DISCORD_TOKEN,
  prefix: process.env.LEMI_PREFIX
});

client.run();

require("http")
  .createServer(function (req, res) {
    res.writeHead(302, {
      'Location': 'https://github.com/Antosik/lemi'
    });
    res.end();
  })
  .listen(process.env.PORT || 5000);