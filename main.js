require('dotenv').config();
const axios = require('axios');
const { Client } = require('@notionhq/client');

const GapiKey = process.env.GAPI_KEY;
const notion_key = process.env.NOTION_KEY;
const notion_db_id = process.env.NOTION_DB_ID;

const notion = new Client({ auth: notion_key });

const GapiUrl = "https://www.googleapis.com/youtube/v3/subscriptions";
const subscriptionDataArray = []

async function getAllSubscriptions(nextPageToken = null) {
  const channelId = "UCtIsoK3_CeNEUDmRfOBNIvQ"; // Replace with your channel ID
  const part = "snippet,contentDetails";
  const maxResults = 50; // Maximum results per page

  let url = `${GapiUrl}?part=${part}&channelId=${channelId}&maxResults=${maxResults}&key=${GapiKey}`;

  if (nextPageToken) {
    url += `&pageToken=${nextPageToken}`;
  }

  // Use axios instead of fetch
  const response = await axios.get(url);
  const data = response.data;

  // Log the subscriptions on the current page
  const dataItems = data.items;
  console.log(dataItems);

  // Loop through each subscription and log the title
  dataItems.forEach(item => {
    let channel_title = item.snippet.title;
    let channel_description = item.snippet.description;
    let channel_cover = item.snippet.thumbnails.high.url;

    // Move the push inside the loop
    const subscriptionData = {
      title: channel_title,
      description: channel_description,
      cover: channel_cover
    };

    subscriptionDataArray.push(subscriptionData);
  });

  console.log(subscriptionDataArray);

  // Check if there are more pages
  if (data.nextPageToken) {
    // Make a recursive call for the next page
    await getAllSubscriptions(data.nextPageToken);
  } else {
    // If there are no more pages, create Notion pages
    createNotionPage();
  }
}

// Call the function to get all subscriptions
getAllSubscriptions();

async function createNotionPage() {
  for (let subscription of subscriptionDataArray) {
    console.log("Sending Data to Notion")
    const page = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: notion_db_id
      },
      "cover": {
        "type": "external",
        "external": {
            "url": subscription.cover
        }
    },
      properties: {
        "Channel_Name": {
          title: [
            {
              type: "text",
              text: {
                content: subscription.title
              }
            }
          ]
        }
      },
      "children": [
        {
          "object": "block",
          "type": "paragraph",
          "paragraph": {
            "rich_text": [{
              "type": "text",
              "text": {
                "content": subscription.description,
                "link": null
              }
            }],
        }}
      ]
    });
    console.log(page);
  }
}
