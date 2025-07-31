/**
 * @file taskController.js
 * @description Görev oluşturma, güncelleme, silme, listeleme ve görev geçmişi (log) işlemlerini yöneten controller fonksiyonlarını içerir.
 * İlgili işlemler servis katmanındaki `taskService.js` dosyası aracılığıyla gerçekleştirilir.
 * @module controllers/taskController
 */

const {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  getTaskLogs
} = require('../services/taskService');

const createTaskHandler = async (req, res) => {
  try {
    const task = await createTask(req.params.projectId, req.body);

    if (req.io) req.io.emit("taskCreated", task);

    res.status(201).json(task);
  } catch (err) {
    console.error('createTask error:', err.message);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message });
  }
};

const getTasksByProjectHandler = async (req, res) => {
  try {
    const tasks = await getTasksByProject(req.params.projectId, req.user);
    res.status(200).json(tasks);
  } catch (err) {
    console.error('getTasksByProject error:', err.message);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message });
  }
};

const updateTaskHandler = async (req, res) => {
  try {
    const task = await updateTask(req.params.id, req.body, req.user.id);

    if (req.io) req.io.emit('task-updated', task);

    res.status(200).json(task);
  } catch (err) {
    console.error('updateTask error:', err.message);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message });
  }
};

const deleteTaskHandler = async (req, res) => {
  try {
    await deleteTask(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('deleteTask error:', err.message);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message });
  }
};

const getTaskLogsHandler = async (req, res) => {
  try {
    const logs = await getTaskLogs(req.params.taskId);
    res.status(200).json(logs);
  } catch (err) {
    console.error('getTaskLogs error:', err.message);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message });
  }
};

module.exports = {
  createTask: createTaskHandler,
  getTasksByProject: getTasksByProjectHandler,
  updateTask: updateTaskHandler,
  deleteTask: deleteTaskHandler,
  getTaskLogs: getTaskLogsHandler
};
