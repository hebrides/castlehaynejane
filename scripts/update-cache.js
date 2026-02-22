#!/usr/bin/env node
/**
 * Script to fetch fresh data from Airtable and update cache files
 * This simulates what the GitHub Action does
 * 
 * Usage:
 *   node scripts/update-cache.js
 * 
 * Requires:
 *   - server/.env with Airtable credentials
 *   OR
 *   - Environment variables set in shell
 */

require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });
const https = require('https');
const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, '../server/data');
const TASKS_FILE = path.join(CACHE_DIR, 'tasks.json');
const CROWDFUND_FILE = path.join(CACHE_DIR, 'crowdfund.json');

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_CATEGORIES_TABLE_ID = process.env.AIRTABLE_CATEGORIES_TABLE_ID;
const AIRTABLE_CROWDFUND_TABLE_ID = process.env.AIRTABLE_CROWDFUND_TABLE_ID;
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function fetchFromAirtable(tableId, fields) {
  return new Promise((resolve, reject) => {
    if (!AIRTABLE_BASE_ID || !tableId || !AIRTABLE_TOKEN) {
      return reject(new Error('Missing Airtable configuration'));
    }

    const fieldParams = fields.map(f => `fields=${encodeURIComponent(f)}`).join('&');
    const pathName = `/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableId)}?${fieldParams}`;

    const request = https.request(
      {
        hostname: 'api.airtable.com',
        path: pathName,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        },
      },
      (response) => {
        let raw = '';
        response.on('data', (chunk) => {
          raw += chunk;
        });
        response.on('end', () => {
          try {
            const payload = JSON.parse(raw || '{}');
            resolve(payload);
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    request.on('error', reject);
    request.end();
  });
}

async function updateTasks() {
  console.log('📋 Fetching tasks from Airtable...');
  try {
    const data = await fetchFromAirtable(
      AIRTABLE_CATEGORIES_TABLE_ID,
      ['tasks', 'checked', 'category', 'summary', 'title']
    );
    
    fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2));
    console.log(`✅ Updated ${TASKS_FILE}`);
    console.log(`   Records: ${data.records?.length || 0}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to update tasks: ${error.message}`);
    return false;
  }
}

async function updateCrowdfund() {
  console.log('💰 Fetching crowdfund data from Airtable...');
  try {
    const data = await fetchFromAirtable(
      AIRTABLE_CROWDFUND_TABLE_ID,
      ['fundTitle', 'description', 'goalAmount']
    );
    
    fs.writeFileSync(CROWDFUND_FILE, JSON.stringify(data, null, 2));
    console.log(`✅ Updated ${CROWDFUND_FILE}`);
    console.log(`   Records: ${data.records?.length || 0}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to update crowdfund: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔄 Updating Airtable cache...\n');

  if (!AIRTABLE_BASE_ID || !AIRTABLE_TOKEN) {
    console.error('❌ Missing Airtable credentials!');
    console.error('   Set environment variables or create server/.env');
    console.error('   See server/.env.example for required variables');
    process.exit(1);
  }

  const tasksOk = await updateTasks();
  const crowdfundOk = await updateCrowdfund();

  console.log('\n' + '─'.repeat(50));
  if (tasksOk && crowdfundOk) {
    console.log('✅ Cache update complete!');
    console.log('\nNext steps:');
    console.log('  1. Review the updated files in server/data/');
    console.log('  2. Commit and push to GitHub');
    console.log('  3. Hosting will auto-deploy with fresh data');
    process.exit(0);
  } else {
    console.log('⚠️  Cache update completed with errors');
    console.log('   Check error messages above');
    process.exit(1);
  }
}

main();
