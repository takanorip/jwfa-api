const express = require('express');
const contentful = require('contentful');
const ogp = require('ogp-parser');
require('dotenv').config();

const app = express();
const client = contentful.createClient({
  space: process.env.SPACE_ID,
  accessToken: process.env.ACCESS_TOKEN
});

app.get('/api', async (req, res) => {
  try {
    const entries = await client.getEntries();
    const items = entries.items;
    const tipsData = items.map(async item => {
      const data = await ogp(item.fields.url, false);
      return data;
    });
    const lastData = await Promise.all(tipsData);
    res.json(lastData);
  } catch(err){
    console.error(err);
  }
});
app.listen(5555, () => console.log('Listening on port 5555'));
