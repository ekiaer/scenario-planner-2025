import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import routes dynamically to avoid build issues
const { registerRoutes } = await import('./routes.js');
await registerRoutes(app);

// Serve static files from the build
const distPath = path.resolve(__dirname, "../dist/public");
app.use(express.static(distPath));

// Fallback for React Router
app.use("*", (req, res) => {
  res.sendFile(path.resolve(distPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Scenario Planning App running on port ${PORT}`);
});
