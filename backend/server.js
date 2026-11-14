const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db.js");

// Load environment variables

const app = express();
// Middleware
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;


app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/complaints', require('./routes/complaintRoutes.js'));

app.get("/", (req, res) => {
  res.send("Hello welocme 5000")

})

// Port configuration

const startServer = async () => {
  await connectDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

