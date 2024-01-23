# YouTube Subscriptions to Notion Database

## Overview

This project allows you to sync your YouTube subscriptions with a Notion database. It creates a Notion page for each subscribed YouTube channel, including relevant details such as title, description, and thumbnail.

## Features

- **Sync on Demand:** Update your Notion database with your latest YouTube subscriptions by running the sync command whenever you want.
- **Rich Data:** Each Notion page includes the YouTube channel's title, description, and a high-quality thumbnail image.

## Getting Started

### Prerequisites

- Node.js installed
- Notion integration token
- Google API key (for YouTube Data API)
- Notion database ID

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/KrishnaAggarwal6/YT-Subscriptions-to-Notion-Database
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up your configuration:

    Create a `.env` file and add your Notion integration token, Notion database ID, and Google API key:

    ```env
    NOTION_TOKEN=your-notion-token
    NOTION_DB_ID=your-notion-database-id
    GOOGLE_API_KEY=your-google-api-key
    ```

## Usage

Run the following command to start the sync process:

```bash
npm start
```

**Please note that the sync is not automatic, and you'll need to run the program to update your Notion database.**

### Configuration
Adjust the `.env` file to customize the configuration:

- `NOTION_TOKEN`: Your Notion integration token.
- `NOTION_DB_ID`: Your Notion database ID.
- `GOOGLE_API_KEY`: Your Google API key for the YouTube Data API.

### Notion Configuration
To use this project, you need to obtain your Notion integration token and the ID of the Notion database where you want to store your YouTube subscriptions.

#### Notion Integration Token
1. Go to the [Notion Integrations page](https://www.notion.so/my-integrations).
2. Create a new integration (if you haven't already).
3. Copy the integration token.
4. Set the obtained Notion integration token in your `.env` file:

```env
NOTION_TOKEN=your-notion-integration-token
```

**Notion Database ID**
1. Open your Notion workspace in a web browser.
2. Locate the Notion database where you want to store YouTube subscriptions.
3. Extract the database ID from the URL. It's the long string of characters after `notion.so/`.
4. Set the obtained Notion database ID in your `.env` file:

```env
NOTION_DB_ID=your-notion-database-id
```

## Contributing

#### Feel free to contribute to this project by opening issues or submitting pull requests. Your input is highly appreciated!

## License

This project is licensed under the [MIT License](https://github.com/KrishnaAggarwal6/YT-Subscriptions-to-Notion-Database?tab=MIT-1-ov-file#).

