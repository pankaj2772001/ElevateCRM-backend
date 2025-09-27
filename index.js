const { initializeData } = require("./db/db.connect");

initializeData();

const express = require("express");

require("dotenv").config();

const app = express();

app.use(express.json());

const SalesAgent = require("./models/SalesAgent.model");

app.get("/", (req, res) => {
  res.send("Hello from the server");
});

async function createNewSalesAgent(newAgent) {
  try {
    const agent = await new SalesAgent(newAgent);

    const savedAgent = await agent.save();

    return savedAgent;
  } catch (error) {
    throw error;
  }
}

app.post("/agents", async (req, res) => {
  try {
    const newAgent = await createNewSalesAgent(req.body);

    res.status(201).json(newAgent);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({
          message: "Sales agent with email 'john@example.com' already exists.",
        });
    }
    return res
      .status(400)
      .json({
        message: "Invalid input: 'email' must be a valid email address.",
      });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
