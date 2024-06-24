const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    task_name:{type:String},
    task_duration_hr:{type:Number},
    task_description:{type:String}
},{timestamps:true})

const TaskSchema = mongoose.model('task',Schema)
module.exports = TaskSchema