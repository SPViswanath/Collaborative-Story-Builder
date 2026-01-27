const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

const http = require("http");
const connectDB = require("./config/db");
const app = require("./app");
const setupSocket = require("./socket"); // ✅ NEW

connectDB();

const PORT = process.env.PORT || 5000;

// ✅ Create HTTP server from Express
const server = http.createServer(app);

// ✅ Plug socket into server
setupSocket(server);

// ✅ Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
