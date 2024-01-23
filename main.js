require('dotenv').config();

const GapiKey = process.env.GAPI_KEY;
const notion_key = process.env.NOTION_KEY;
const notion_db_id = process.env.NOTION_DB_ID;

const GapiUrl = "https://www.googleapis.com/youtube/v3/subscriptions";

async function getAllSubscriptions(nextPageToken = null) {
    const channelId = "UCtIsoK3_CeNEUDmRfOBNIvQ"; // Replace with your channel ID
    const part = "snippet,contentDetails";
    const maxResults = 50; // Maximum results per page
  
    let url = `${GapiUrl}?part=${part}&channelId=${channelId}&maxResults=${maxResults}&key=${GapiKey}`;
  
    if (nextPageToken) {
      url += `&pageToken=${nextPageToken}`;
    }
  
    const response = await fetch(url);
    const data = await response.json();
  
    // Log the subscriptions on the current page
    const dataItems = data.items;
    console.log(dataItems)
    // Loop through each subscription and log the title
    dataItems.forEach(item => {
      let channel_title = item.snippet.title;
      let channel_description = item.snippet.description;  
      let channel_cover = item.snippet.thumbnails.high.url;  
    });
  
    // Check if there are more pages
    if (data.nextPageToken) {
      // Make a recursive call for the next page
      await getAllSubscriptions(data.nextPageToken);
    }
  
}
  // Call the function to get all subscriptions
  getAllSubscriptions();
  

  // Check if there are more pag