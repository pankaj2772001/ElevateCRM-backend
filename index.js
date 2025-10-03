const { initializeData } = require("./db/db.connect");

initializeData();
const mongoose = require("mongoose");

const express = require("express");

require("dotenv").config();

const app = express();

app.use(express.json());

const SalesAgent = require("./models/SalesAgent.model");
const Lead = require("./models/Lead.model");

//! Query for creating the new Lead

async function createNewLead(newLead) {
  try {
    const lead = new Lead(newLead);

    const saveLead = await lead.save();

    return saveLead;
  } catch (error) {
    throw error;
  }
}

app.post("/leads", async (req, res) => {
  try {
    const { name, source, salesAgent, status, timeToClose, priority } =
      req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        error: "Invalid input: 'name' is required and must be a string.",
      });
    }

    const allowedSources = ["Referral", "Website", "Advertisement", "Event"];

    if (!source || !allowedSources.includes(source)) {
      return res.status(400).json({
        error:
          "Invalid input: 'source' must be one of " + allowedSources.join(", "),
      });
    }

    if (salesAgent && !mongoose.Types.ObjectId.isValid(salesAgent)) {
      return res.status(400).json({
        error: "Invalid input: 'salesAgent' must be a valid ObjectId.",
      });
    }

    const allowedStatus = [
      "New",
      "Contacted",
      "Qualified",
      "Proposal Sent",
      "Closed",
    ];

    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        error:
          "Invalid input: 'status' must be one of " +
          allowedStatuses.join(", "),
      });
    }

    if (timeToClose <= 0) {
      return res.status(400).json({
        error: "Invalid input: 'timeToClose' must be a positive integer.",
      });
    }

    const allowedPriority = ["High", "Medium", "Low"];

    if (!priority || !allowedPriority.includes(priority)) {
      return res.status(400).json({
        error:
          "Invalid input: 'priority' must be one of " +
          allowedPriority.join(", "),
      });
    }

    if (salesAgent) {
      const agentExists = await SalesAgent.findById(salesAgent);

      if (!agentExists) {
        return res.status(404).json({ error: "Sales agent ID not found." });
      }
    }

    const lead = await createNewLead(req.body);

    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//! QUery for the updating the existing lead

async function updateLead(leadId, dataToUpdate) {
  try {
    const updatatedLead = await Lead.findByIdAndUpdate(leadId, dataToUpdate, {
      new: true,
    });

    return updatatedLead;
  } catch (error) {
    throw error;
  }
}

app.put("/leads/:id", async (req, res) => {
  try {
    const { name, source, salesAgent, status, timeToClose, priority } =
      req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        error:
          "Invalid input: 'source' must be one of " + allowedSources.join(", "),
      });
    }

    const allowedSources = ["Referral", "Website", "Advertisement", "Event"];

    if (!source || !allowedSources.includes(source)) {
      return res.status(400).json({
        error:
          "Invalid input: 'source' must be one of " + allowedSources.join(", "),
      });
    }

    if (salesAgent && !mongoose.Types.ObjectId.isValid(salesAgent)) {
      return res.status(400).json({
        error: "Invalid input: 'salesAgent' must be a valid ObjectId.",
      });
    }

    const allowedStatus = [
      "New",
      "Contacted",
      "Qualified",
      "Proposal Sent",
      "Closed",
    ];

    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        error:
          "Invalid input: 'status' must be one of " +
          allowedStatuses.join(", "),
      });
    }

    if (timeToClose <= 0) {
      return res.status(400).json({
        error: "Invalid input: 'timeToClose' must be a positive integer.",
      });
    }

    const allowedPriority = ["High", "Medium", "Low"];

    if (!priority || !allowedPriority.includes(priority)) {
      return res.status(400).json({
        error:
          "Invalid input: 'priority' must be one of " +
          allowedPriority.join(", "),
      });
    }

    if (salesAgent) {
      const agentExists = await SalesAgent.findById(salesAgent);

      if (!agentExists) {
        return res.status(404).json({ error: "Sales agent ID not found." });
      }
    }

    const updatatedLead = await updateLead(req.params.id, req.body);

    res.status(200).json(updatatedLead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//! Query for deleting the lead

async function deleteLead(leadId) {
  try {
    const deletedLead = await Lead.findByIdAndDelete(leadId);

    return deletedLead;
  } catch (error) {
    throw error;
  }
}

app.delete("/leads/:id", async (req, res) => {
  try {
    const deletedLead = await deleteLead(req.params.id);

    if (!deletedLead) {
      res
        .status(404)
        .json({ error: "Lead with ID '64c34512f7a60e36df44' not found." });
    } else {
      res.status(200).json({ message: "Lead deleted successfully." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//! Query for the creating the new sales Agent

async function createNewSalesAgent(newAgent) {
  try {
    const agent = new SalesAgent(newAgent);

    const savedAgent = await agent.save();

    return savedAgent;
  } catch (error) {
    throw error;
  }
}

app.post("/agents", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ error: "name is required and must be a string." });
    }
    const newAgent = await createNewSalesAgent(req.body);

    res.status(201).json(newAgent);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Sales agent with email 'john@example.com' already exists.",
      });
    }
    return res.status(400).json({
      message: "Invalid input: 'email' must be a valid email address.",
    });
  }
});

//! Query to get all agents

async function getAllAgents() {
  try {
    const allAgents = await SalesAgent.find();

    return allAgents;
  } catch (error) {
    throw error;
  }
}

app.get("/agents", async (req, res) => {
  try {
    const allAgents = await getAllAgents();

    if (allAgents.length === 0) {
      res.status(404).json({ message: "No Agents Found." });
    } else {
      res.status(200).json(allAgents);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch agents" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
