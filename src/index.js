const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('./db/mongoose.js')

const app = express()
const port = process.env.PORT 

// app.use((req,res,next)=>{
//     res.status(503).send("The webApp is under mentanence")
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log('Server is run on port: '+port)
})

