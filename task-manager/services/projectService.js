/**
 * @file projectService.js
 * @description Proje oluşturma, listeleme ve detay görüntüleme işlemlerine ait iş mantığını içerir.
 * @module services/projectService
 */

const Project = require('../models/Project');
const Task = require('../models/Task');
const CustomError = require('../utils/customError');

const createProject = async ({ name, description, createdBy }) => {
  if (!name) throw new CustomError(400, 'Project name is required');

  const newProject = new Project({
    name,
    description,
    createdBy,
  });

  await newProject.save();
  return newProject;
};

const getProjectsForUser = async (user) => {
  if (user.role === 'Admin' || user.role === 'Manager') {
    return await Project.find().populate('createdBy', 'name email role');
  }

  const ownProjects = await Project.find({ createdBy: user.id });
  const assignedTasks = await Task.find({ assignedTo: user.id }).select('project');
  const projectIds = assignedTasks.map((task) => task.project.toString());

  const uniqueProjectIds = [...new Set([...ownProjects.map(p => p._id.toString()), ...projectIds])];

  return await Project.find({ _id: { $in: uniqueProjectIds } })
    .populate('createdBy', 'name email role');
};

const getProjectByIdForUser = async (projectId, user) => {
  const project = await Project.findById(projectId).populate('createdBy', 'name email role');

  if (!project) {
    throw new CustomError(404, 'Project not found');
  }

  if (
    user.role === 'Admin' ||
    user.role === 'Manager' ||
    project.createdBy._id.toString() === user.id
  ) {
    return project;
  }

  const hasTask = await Task.exists({ project: projectId, assignedTo: user.id });
  if (hasTask) {
    return project;
  }

  throw new CustomError(403, 'Unauthorized to access this project');
};

module.exports = {
  createProject,
  getProjectsForUser,
  getProjectByIdForUser,
};
