# Castle Hayne Jane's Family Farm Online

Website &amp; e-commerce for family farm and event space.

## Local API Server

The repository now includes a minimal Express API inside `server/` that returns the
task menu data from `js/taskData.js`.

```bash
cd server
npm install
npm run dev # or `npm start`
```

Once running, the endpoint `GET http://localhost:4000/api/tasks` responds with the
`sections` payload that mirrors the data used on the volunteer page. Point the
front-end fetch logic at this endpoint when you're ready to hydrate tasks from the
backend instead of the embedded script.

### Environment Variables

Server-side integrations (e.g., Airtable) should load credentials from `server/.env`.
Copy the sample file and fill in your keys:

```bash
cp server/.env.example server/.env
```

The `.env` file is gitignored so your API keys remain local.
