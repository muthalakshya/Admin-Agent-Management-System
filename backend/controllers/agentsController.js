import agentsModel from '../models/agentModel.js';  // Keep the .js extension

// Route for admin login
const addAgents = async (req, res) => {
    try {
        console.log(req.body)
        const { name, email, password, phoneNumber } = req.body
        console.log(name, email, password, phoneNumber )

        const agent = new agentsModel(req.body)
        await agent.save()

        res.json( {success : true, message: "Agent added"})

    } catch (error) {
        console. log(error)
        res.json( {success : false, message: error. message})
    }
}

const listAgents = async (req, res) => {
    try {
        const agent = await agentsModel.find({});
        res.json({success:true, agent});
    } catch (error) {
        console. log(error)
        res.json( {success : false, message: error. message})
    }
}

// function for removing product
const removeAgents = async (req, res) => {
    try {
        // console.log(req.body.id)
        await  agentsModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Deleted"})
    } catch (error) {
        console. log(error)
        res.json( {success : false, message: error. message})
    }
}

// function for single Agents info
const singleAgents = async (req, res) => {
    try {
        const {agentId} = req.body;
        const agent = await agentsModel.findById(agentId);
        res.json({success:true, agent});
    } catch (error) {
        console. log(error)
        res.json( {success : false, message: error.message})
    }
}


export { addAgents, listAgents, removeAgents, singleAgents };