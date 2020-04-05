const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('./db/mongoose.js')

const app = express()

// app.use((req,res,next)=>{
//     res.status(503).send("The webApp is under mentanence")
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app
