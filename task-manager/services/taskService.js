/**
 * @file taskService.js
 * @description Görev oluşturma, güncelleme, silme, listeleme ve görev geçmişi işlemlerini içerir.
 * @module services/taskService
 */

const Task = require('../models/Task');
const TaskLog = require('../models/TaskLog');
const CustomError = require('../utils/customError');

const createTask = async (projectId, data) => {
  const task = new Task({ ...data, project: projectId });
  await task.save();
  return task;
};

const getTasksByProject = async (projectId, user) => {
  if (user.role === 'Admin' || user.role === 'Manager') {
    return Task.find({ project: projectId }).populate('assignedTo', 'name email role');
  }

  return Task.find({ project: projectId, assignedTo: user.id }).populate('assignedTo', 'name email role');
};

const updateTask = async (taskId, updates, changedBy) => {
  const oldTask = await Task.findById(taskId);
  if (!oldTask) throw new CustomError(404, 'Task not found');

  const assignedUser = await Task.populate(oldTask, {
    path: 'assignedTo',
    select: 'name'
  });

  await TaskLog.create({
    taskId: oldTask._id,
    previousData: {
      title: oldTask.title,
      description: oldTask.description,
      status: oldTask.status,
      priority: oldTask.priority,
      assignedTo: assignedUser.assignedTo?.name || 'Unassigned'
    },
    changedBy
  });

  const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true })
    .populate('assignedTo', 'name email role');

  return updatedTask;
};

const deleteTask = async (taskId) => {
  const deleted = await Task.findByIdAndDelete(taskId);
  if (!deleted) throw new CustomError(404, 'Task not found');
  return deleted;
};

const getTaskLogs = async (taskId) => {
  return TaskLog.find({ taskId }).populate('changedBy', 'name email role');
};

module.exports = {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  getTaskLogs,
};
