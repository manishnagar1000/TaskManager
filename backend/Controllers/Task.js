const TaskSchema = require("../Models/Task");

const CreateTask = async (req, res) => {
  try {
    const { taskName, taskDuration, taskDescription } = req.body;
    if (!taskName) {
      return res.status(401).json({ error: "Task name is not defined" });
    }
    const newTask = new TaskSchema({
      task_name: taskName,
      task_duration_hr: taskDuration,
      task_description: taskDescription,
    });
    await newTask.save();
    res.status(200).json({ message: "Task Created Successfully" });
  } catch (e) {
    res.send(e);
  }
};
const GetTask = async (req, res) => {
  try {
    const { id } = req.params;
    let tasks;
    if (id) {
      tasks = await TaskSchema.findOne({ _id: id });
    } else {
      tasks = await TaskSchema.find({});
    }
    res.status(200).json({data:tasks});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
const DeleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await TaskSchema.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
const UpdateTask = async (req, res) => {
    try {
      const { id } = req.params;
      const { taskName, taskDuration, taskDescription } = req.body;
      const updatedTask = await TaskSchema.findByIdAndUpdate(
        id,
        {
          task_name: taskName,
          task_duration_hr: taskDuration,
          task_description: taskDescription
        },
        { new: true, runValidators: true }
      );
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json({ message: "Task updated successfully", updatedTask });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  };

module.exports = {
  CreateTask,
  GetTask,
  DeleteTask,
  UpdateTask
};
//