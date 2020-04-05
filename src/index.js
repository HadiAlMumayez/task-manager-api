const app = require('./app')
const app = express()
const port = process.env.PORT 

app.listen(port,()=>{
    console.log('Server is run on port: '+port)
})

