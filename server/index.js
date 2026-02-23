require("dotenv").config();
const express = require("express");
const cors = require("cors");
const https = require("https");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 4000;

// Cache configuration
const CACHE_DIR = path.join(__dirname, "data");
const TASKS_CACHE_FILE = path.join(CACHE_DIR, "tasks.json");
const CROWDFUND_CACHE_FILE = path.join(CACHE_DIR, "crowdfund.json");
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_CATEGORIES_TABLE_ID = process.env.AIRTABLE_CATEGORIES_TABLE_ID;
const AIRTABLE_CROWDFUND_TABLE_ID = process.env.AIRTABLE_CROWDFUND_TABLE_ID;
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;

// Helper to read cached data
const readCache = (filepath) => {
  try {
    if (fs.existsSync(filepath)) {
      const data = fs.readFileSync(filepath, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading cache from ${filepath}:`, error);
  }
  return null;
};

// Helper to write cache
const writeCache = (filepath, data) => {
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error(`Error writing cache to ${filepath}:`, error);
    return false;
  }
};

const fetchTasksByCategories = () =>
  new Promise((resolve, reject) => {
    if (!AIRTABLE_BASE_ID || !AIRTABLE_CATEGORIES_TABLE_ID || !AIRTABLE_TOKEN) {
      const cached = readCache(TASKS_CACHE_FILE);
      if (cached) {
        console.log("Using cached tasks data (no Airtable config)");
        return resolve(cached);
      }
      return reject(
        new Error("Missing Airtable configuration and no cached data available"),
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
            // Cache the successful response
            writeCache(TASKS_CACHE_FILE, payload);
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
      const cached = readCache(CROWDFUND_CACHE_FILE);
      if (cached) {
        console.log("Using cached crowdfund data (no Airtable config)");
        return resolve(cached);
      }
      return reject(
        new Error("Missing Airtable configuration and no cached data available"),
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
            // Cache the successful response
            writeCache(CROWDFUND_CACHE_FILE, payload);
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
    // Try to serve cached data as fallback
    const cached = readCache(TASKS_CACHE_FILE);
    if (cached) {
      console.log("Serving cached tasks data after fetch failure");
      return res.json(cached);
    }
    res.status(500).json({ error: "Unable to fetch data and no cache available" });
  }
});

app.get("/api/crowdfund", async (req, res) => {
  try {
    const airtableData = await fetchCrowdfundBreakdown();
    res.json(airtableData);
  } catch (error) {
    console.error("Crowdfund fetch failed:", error);
    // Try to serve cached data as fallback
    const cached = readCache(CROWDFUND_CACHE_FILE);
    if (cached) {
      console.log("Serving cached crowdfund data after fetch failure");
      return res.json(cached);
    }
    res.status(500).json({ error: "Unable to fetch data and no cache available" });
  }
});

// Cache refresh endpoint (useful for cron jobs)
app.post("/api/refresh-cache", async (req, res) => {
  const results = { tasks: null, crowdfund: null, errors: [] };
  
  try {
    const tasksData = await fetchTasksByCategories();
    writeCache(TASKS_CACHE_FILE, tasksData);
    results.tasks = "success";
    console.log("Cache refreshed: tasks");
  } catch (error) {
    results.errors.push(`Tasks: ${error.message}`);
    console.error("Cache refresh failed for tasks:", error.message);
  }
  
  try {
    const crowdfundData = await fetchCrowdfundBreakdown();
    writeCache(CROWDFUND_CACHE_FILE, crowdfundData);
    results.crowdfund = "success";
    console.log("Cache refreshed: crowdfund");
  } catch (error) {
    results.errors.push(`Crowdfund: ${error.message}`);
    console.error("Cache refresh failed for crowdfund:", error.message);
  }
  
  const statusCode = results.errors.length > 0 ? 500 : 200;
  res.status(statusCode).json(results);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task API listening on port ${PORT}`);
  });
}

module.exports = app;
