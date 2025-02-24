import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Serve static files from the dist directory
app.use(express.static(join(__dirname, "dist")));

// Handle React routing, return all requests to React app
app.get("*", function (req, res) {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
