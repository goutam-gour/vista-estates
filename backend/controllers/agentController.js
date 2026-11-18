import mongoose from "mongoose";
import Agent from "../models/Agent.js";

// 1. Get All Agents
export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().populate("properties");

    res.status(200).json({
      success: true,
      count: agents.length,
      agents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 2. Get Agent By ID
export const getAgentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Agent ID",
      });
    }

    const agent = await Agent.findById(id).populate("properties");

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    res.status(200).json({
      success: true,
      agent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3. Create Agent
export const createAgent = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      photo,
      bio,
      experience,
      rating,
      licenseNumber,
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required",
      });
    }

    const existingAgent = await Agent.findOne({ email });

    if (existingAgent) {
      return res.status(400).json({
        success: false,
        message: "Agent already exists",
      });
    }

    const agent = await Agent.create({
      name,
      email,
      phone,
      photo,
      bio,
      experience,
      rating,
      licenseNumber,
    });

    res.status(201).json({
      success: true,
      message: "Agent created successfully",
      agent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 4. Update Agent
export const updateAgent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Agent ID",
      });
    }

    const agent = await Agent.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Agent updated successfully",
      agent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 5. Delete Agent
export const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Agent ID",
      });
    }

    const agent = await Agent.findByIdAndDelete(id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Agent deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};