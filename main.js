require('dotenv').config();
const axios = require('axios');
const { Client } = require('@notionhq/client');

const GapiKey = process.env.GAPI_KEY;
const notion_key = process.env.NOTION_KEY;
const notion_db_id = process.env.NOTION_DB_ID;

const notion = new Client({ auth: notion_key });
const GapiUrl = "https://www.googleapis.com/youtube/v3/subscriptions";
const AlreadySubscription = [];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let NewSubscriptions = [];
let i = 1
async function getAllPages() {
  try {
    // Query the Notion database to retrieve all pages
    const response = await notion.databases.query({
      database_id: notion_db_id,
    });

    // Extract page information
    const pages = response.results.map(page => ({
      id: page.id,
      title: page.properties.Channel_Name?.title[0]?.text?.content,
    }));

    // Filter out pages without a valid title
    const validPages = pages.filter(page => page.title);

    // Push titles into AlreadySubscription array
    validPages.forEach(page => {
      AlreadySubscription.push(page.title);
    });

  } catch (error) {
    console.error("Error querying Notion database:", error);
  }
}

async function subscriptionExistsInNotion(title) {
  try {
    // Query the Notion database to check if the subscription exists
    const response = await notion.databases.query({
      database_id: notion_db_id,
      filter: {
        property: 'Channel_Name',
        title: {
          equals: title,
        },
      },
    });

    // Check if there are any results
    const entries = response.results;
    return entries.length > 0; // If there are entries, subscription exists

  } catch (error) {
    console.error("Error checking subscription in Notion:", error);
    return false; // Error occurred, assume subscription doesn't exist
  }
}
async function getAllSubscriptions() {
  await getAllPages();

  const channelId = "UCtIsoK3_CeNEUDmRfOBNIvQ"; // Replace with your Youtube channel ID
  const part = "snippet,contentDetails";
  const maxResults = 50; // Maximum results per page

  let nextPageToken = null;

  try {
    do {
      let url = `${GapiUrl}?part=${part}&channelId=${channelId}&maxResults=${maxResults}&key=${GapiKey}`;
      console.log(url)

      if (nextPageToken) {
        url += `&pageToken=${nextPageToken}`;
      }

      // Use axios instead of fetch
      const response = await axios.get(url);
      const data = response.data;

      // Log the subscriptions on the current page
      const dataItems = data.items;

      for (let item of dataItems) {
        let channel_title = item.snippet.title;

        if (AlreadySubscription.includes(channel_title)) {
          console.log(`Already subscribed to: ${channel_title} ${i}  `)
          i++;
          continue;
        }

        // Check if the subscription exists in Notion
        const existsInNotion = await subscriptionExistsInNotion(channel_title);
        if (existsInNotion) {
          console.log(`Already subscribed to: ${channel_title} in Notion`);
          i++;
          console.log(i)
          continue;
        }

        let channel_description = item.snippet.description;
        let channel_cover = item.snippet.thumbnails.high.url;
        let channel_url = `https://www.youtube.com/channel/${item.snippet.resourceId.channelId}`

        const subscriptionData = {
          title: channel_title,
          description: channel_description,
          cover: channel_cover,
          Curl: channel_url,
        };

        // Only push the data if it's not already in AlreadySubscription and doesn't exist in Notion
        if (!AlreadySubscription.includes(channel_title) && !existsInNotion) {
          NewSubscriptions.push(subscriptionData);
          console.log("Adding New Subscription");
          await createNotionPage(subscriptionData);
        }
      }

      // Update nextPageToken for the next iteration
      nextPageToken = data.nextPageToken;

      // If there are more pages, log and update nextPageToken
      if (nextPageToken) {
        console.log("Moving on to the next page");
        // Sleep for 1 second to avoid hitting API limits too quickly
        await sleep(1000);
      }

    } while (nextPageToken);

  } catch (error) {
    console.error("Error fetching subscriptions:", error);
  }
}


async function createNotionPage(subscription) {
  console.log("Sending Data to Notion");
  try {
    const page = await notion.pages.create({
      parent: {
        database_id: notion_db_id,
      },
      cover: {
        type: "external",
        external: {
          url: subscription.cover,
        },
      },
      "icon": {
        "type": "emoji",
        "emoji": "📽️"
    },
      properties: {
        Channel_Name: {
          title: [
            {
              text: {
                content: subscription.title,
              },
            },
          ],
        },
        Channel_Link: {
          type: "url",
          url: subscription.Curl
        }
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: subscription.description,
                  link: null,
                },
              },
            ],
          },
        },
      ],
    });

    console.log(`Sending Subscription to Notion Database for ${subscription.title}`);
  } catch (error) {
    console.error(`Error creating Notion page for ${subscription.title}:`, error);
  }
}

// Call the function to get all subscriptions
getAllSubscriptions();
