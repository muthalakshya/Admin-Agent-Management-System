import express, { json } from 'express'
import cors from 'cors'
import 'dotenv/config'
import  connectDB from './config/mongodb.js'
import userRouter from './routes/useRoute.js'
import agentRouter from './routes/agentsRoute.js'
import listRouter from './routes/listRouter.js'

const app = express();
const port = process.env.PORT || 4000;
connectDB()

app.use(express.json())
app.use(cors())

app.use('/api/user',userRouter)
app.use('/api/agent',agentRouter)
app.use('/api/list',listRouter)


app.get('/', (req,res)=>{
    res.send("API Work")
})

app.listen(port, ()=> console.log("Server Start"))