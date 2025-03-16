import express from 'express';
import { addAgents, listAgents, removeAgents, singleAgents } from '../controllers/agentsController.js';

const agentRouter = express.Router();

agentRouter.post("/add-agent", addAgents)
agentRouter.post("/single-agent", singleAgents)
agentRouter.post("/remove-agent", removeAgents)
agentRouter.get("/list-agent", listAgents)

export default agentRouter;