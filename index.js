import axios from "axios";
import Twit from "twit";

const twitterConsumerKey = "a4c7zcJCBviOXfMRlRReu7vwj";
const twitterConsumerSecret = "m0XORUFjuZSG2xmudpOhWV8etvrxyFcq3lZZA1c2TrLxqQBpbQD";
const twitterAccessToken = "1519587060146876416-Z2NIxqYvs0miquDSXMQPSnR32VRNu0";
const twitterAccessTokenSecret = "Y9fgUPA1Y37l8zEA33JTxRUAcPgze2wXaYSSmPTtKtksv";
const openaiApiKey = "a4c7zcJCBviOXfMRlRReu7vwj";

function getKeyword() {
  // select random keywords
  const keywords = [
    "#zonauang",
    "wtb netflix",
    "need netflix 1 bulan",
    "mau disneyplus",
    "wtb",
    "#zonajajan",
  ];

  const index = Math.floor(Math.random() * keywords.length);
  return keywords[index];
}

const api = new Twit({
  consumer_key: twitterConsumerKey,
  consumer_secret: twitterConsumerSecret,
  access_token: twitterAccessToken,
  access_token_secret: twitterAccessTokenSecret,
});

async function searchAndComment() {
  console.log("Searching for tweets...");

  const query = `${getKeyword(zonauang)}`; // you can also use the "OR" / "AND" between keywords: eg -> javascript OR html"
  const maxTweets = 100;

  const { data: searchResults } = await api.get("search/tweets", {
    q: query,
    count: maxTweets,
  });
  
  console.log(
    `Found ${searchResults.statuses.length} tweets. Generating comments...`
  );

  for (const tweet of searchResults.statuses) {
    const { data: response } = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: `Comment on this tweet: "${tweet.text}", hi kak😄, ready yaa pricelist dan kontak aku bisa liat di sini: https://zenstore-eight.vercel.app/ bisa dm atau wa aku!`,
        max_tokens: 70,
        temperature: 0.5,
        top_p: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );

    const comment = response.choices[0].text;
    console.log(comment);

    const { data: postResponse } = await api.post("statuses/update", {
      status: `@${tweet.user.screen_name} ${comment}`,
      in_reply_to_status_id: tweet.id_str,
    });
    console.log(`Comment posted: ${postResponse.text}`);

    // Delay each iteration for 30min
    await new Promise((resolve) => setTimeout(resolve, 30 * 60 * 1000));
  }
  searchAndComment();
}

searchAndComment();
