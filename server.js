const express = require("express");
const app = express();
const port = 4000;

const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require("cors");

const PORT = process.env.PORT || 4000;

// Enable CORS for cross-origin requests
app.use(cors());

// To allow the use of environment variables
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the "calculator-app/public" directory
app.use(express.static("calculator-app/public"));

// Create a MySQL pool to connect to the database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Endpoint to handle POST requests for savings calculations
app.post("/v1/savings", (req, res) => {
  const {
    systemSize,
    totalSystemCost,
    targetMonthlyPayment,
    monthlyPayment,
    name,
    email,
    state,
  } = req.body;

  // Insert the provided data along with created_at and updated_at timestamps
  pool.query(
    "INSERT INTO savings (systemSize, totalSystemCost, targetMonthlyPayment, monthlyPayment, name, email, state, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
    [
      systemSize,
      totalSystemCost,
      targetMonthlyPayment,
      monthlyPayment,
      name,
      email,
      state,
    ],
    (error, results) => {
      if (error) {
        // Send a 400 status code with the error message if the query fails
        return res.status(400).json({ message: error.message });
      }
      // Send a 201 status code with the inserted data if the query succeeds
      res.status(201).json({
        id: results.insertId,
        systemSize,
        totalSystemCost,
        targetMonthlyPayment,
        monthlyPayment,
        name,
        email,
        state,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  );
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${port}`);
});
