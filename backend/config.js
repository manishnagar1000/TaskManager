const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://mani:mani123@manishapi.vdszlrk.mongodb.net/Task01?retryWrites=true&w=majority&appName=ManishApi').then((res)=>{
    console.log("connection success")
}).catch(err=>{
    console.error(err)
})