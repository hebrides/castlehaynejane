const express = require("express");
const cors = require("cors");
const path = require("path");

const taskSections = require(path.join(__dirname, "../js/taskData"));

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/tasks", (req, res) => {
  res.json({ sections: taskSections });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task API listening on port ${PORT}`);
  });
}

module.exports = app;
