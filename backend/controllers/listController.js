import agentsModel from '../models/agentModel.js';
import listModel from '../models/listModel.js';

// Route to distribute lists among agents
const distributeLists = async (req, res) => {
  try {
    const { distribution } = req.body;
    
    if (!distribution || !Array.isArray(distribution)) {
      return res.status(400).json({ success: false, message: 'Invalid distribution data' });
    }
    
    // Validate each agent exists
    for (const list of distribution) {
      const agent = await agentsModel.findById(list.agentId);
      if (!agent) {
        return res.status(404).json({ 
          success: false, 
          message: `Agent with ID ${list.agentId} not found` 
        });
      }
    }
    
    // Delete previous lists (optional, depending on your requirements)
    await listModel.deleteMany({});
    
    // Create new lists in database
    const savedLists = await Promise.all(
      distribution.map(async (list) => {
        const newList = new listModel({
          agentId: list.agentId,
          agentName: list.agentName,
          items: list.items,
          assignedDate: new Date()
        });
        
        return await newList.save();
      })
    );
    
    return res.status(200).json({
      success: true,
      message: 'Lists distributed successfully',
      lists: savedLists
    });
    
  } catch (error) {
    console.error('Error distributing lists:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while distributing lists',
      error: error.message
    });
  }
};

// Route to get all distributed lists
const getDistributedLists = async (req, res) => {
  try {
    const lists = await listModel.find({}).sort({ assignedDate: -1 });
    
    return res.status(200).json({
      success: true,
      lists
    });
    
  } catch (error) {
    console.error('Error fetching lists:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching lists',
      error: error.message
    });
  }
};

// Route to get lists for a specific agent
const getAgentLists = async (req, res) => {
  try {
    const { agentId } = req.params;
    
    const list = await listModel.findOne({ agentId });
    
    if (!list) {
      return res.status(404).json({
        success: false,
        message: 'No list found for this agent'
      });
    }
    
    return res.status(200).json({
      success: true,
      list
    });
    
  } catch (error) {
    console.error('Error fetching agent list:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching agent list',
      error: error.message
    });
  }
};

export { distributeLists, getDistributedLists, getAgentLists };