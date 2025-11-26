require("dotenv").config();
const express = require("express");
const cors = require("cors");
const https = require("https");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_CATEGORIES_TABLE_ID = process.env.AIRTABLE_CATEGORIES_TABLE_ID;
const AIRTABLE_CROWDFUND_TABLE_ID = process.env.AIRTABLE_CROWDFUND_TABLE_ID;
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;

const fetchTasksByCategories = () =>
  new Promise((resolve, reject) => {
    if (!AIRTABLE_BASE_ID || !AIRTABLE_CATEGORIES_TABLE_ID || !AIRTABLE_TOKEN) {
      return reject(
        new Error("Missing Airtable configuration in environment variables"),
      );
    }

    const pathName = `/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
      AIRTABLE_CATEGORIES_TABLE_ID,
    )}?&fields=tasks&fields=checked&fields=category&fields=summary&fields=title`;

    const request = https.request(
      {
        hostname: "api.airtable.com",
        path: pathName,
        method: "GET",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        },
      },
      (response) => {
        let raw = "";
        response.on("data", (chunk) => {
          raw += chunk;
        });
        response.on("end", () => {
          try {
            const payload = JSON.parse(raw || "{}");
            resolve(payload);
          } catch (error) {
            reject(error);
          }
        });
      },
    );

    request.on("error", reject);
    request.end();
  });

const fetchCrowdfundBreakdown = () =>
  new Promise((resolve, reject) => {
    if (!AIRTABLE_BASE_ID || !AIRTABLE_CROWDFUND_TABLE_ID || !AIRTABLE_TOKEN) {
      return reject(
        new Error("Missing Airtable configuration in environment variables"),
      );
    }

    const pathName = `/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
      AIRTABLE_CROWDFUND_TABLE_ID,
    )}?fields=fundTitle&fields=description&fields=goalAmount`;

    const request = https.request(
      {
        hostname: "api.airtable.com",
        path: pathName,
        method: "GET",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        },
      },
      (response) => {
        let raw = "";
        response.on("data", (chunk) => {
          raw += chunk;
        });
        response.on("end", () => {
          try {
            const payload = JSON.parse(raw || "{}");
            resolve(payload);
          } catch (error) {
            reject(error);
          }
        });
      },
    );

    request.on("error", reject);
    request.end();
  });

app.use(cors());
app.use(express.json());
const clientRoot = path.resolve(__dirname, "..");
app.use(
  express.static(clientRoot, {
    extensions: ["html"],
  }),
);

app.get("/", async (req, res) => {
  res.send("<p>Uh hello? hehe.. hello!</p>")
})

app.get("/api/tasks", async (req, res) => {
  try {
    const airtableData = await fetchTasksByCategories();
    res.json(airtableData);
  } catch (error) {
    console.error("Airtable fetch failed:", error);
    res.status(500).json({ error: "Unable to fetch Airtable data" });
  }
});

app.get("/api/crowdfund", async (req, res) => {
  try {
    const airtableData = await fetchCrowdfundBreakdown();
    res.json(airtableData);
  } catch (error) {
    console.error("Crowdfund fetch failed:", error);
    res.status(500).json({ error: "Unable to fetch crowdfund data" });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task API listening on port ${PORT}`);
  });
}

module.exports = app;
