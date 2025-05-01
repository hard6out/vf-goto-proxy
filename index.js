import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import convert from './utils/numToString.js';

dotenv.config();
const app  = express();
const PORT = process.env.PORT || 3000;

/* --- helper that calls the real GoTo Webinar REST API ------------------ */
async function goTo(path) {
  const res = await fetch(`https://api.getgo.com/G2W/rest/v2${path}`, {
    headers: { Authorization: `Bearer ${process.env.GOTO_TOKEN}` }
  });
  if (!res.ok) throw new Error(`GoTo returned ${res.status}`);
  return res.json();
}

/* --- proxy endpoint ---------------------------------------------------- */
/* Example call from Voiceflow: GET /webinar/123456?registrants=true       */
app.get('/webinar/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { registrants } = req.query;
    const apiPath = registrants
      ? `/organizers/me/webinars/${key}/registrants`
      : `/organizers/me/webinars/${key}`;

    const raw  = await goTo(apiPath);
    const safe = convert(raw);
    res.json(safe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () =>
  console.log(`Proxy running → http://localhost:${PORT}`)
);
