import express from 'express';
import { distributeLists, getAgentLists, getDistributedLists } from '../controllers/listController.js';

const listRouter = express.Router();

listRouter.post('/distribute', distributeLists)
listRouter.get('/list', getDistributedLists)
listRouter.get('/agent/:agentId', getAgentLists)

export default listRouter;