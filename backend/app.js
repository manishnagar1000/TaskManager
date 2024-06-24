const express = require ("express")
require('./config')
const app  = express()
const cors = require('cors')
const Router = require('./router')
app.use(cors())
app.use('/api',Router)

app.listen(8000,()=>{
    console.log('server running at 8000 port')
})
