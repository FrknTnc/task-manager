/**
 * @file projectController.js
 * @description Proje oluşturma, listeleme ve detay görüntüleme işlemlerini yöneten controller fonksiyonlarını içerir.
 * İlgili işlemler servis katmanındaki `projectService.js` dosyası aracılığıyla gerçekleştirilir.
 * @module controllers/projectController
 */

const {
  createProject,
  getProjectsForUser,
  getProjectByIdForUser,
} = require('../services/projectService');

const createProjectHandler = async (req, res) => {
  try {
    const newProject = await createProject({
      name: req.body.name,
      description: req.body.description,
      createdBy: req.user.id,
    });

    res.status(201).json(newProject);
  } catch (err) {
    console.error('createProject error:', err.message);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message });
  }
};

const getProjectsHandler = async (req, res) => {
  try {
    const projects = await getProjectsForUser(req.user);
    res.status(200).json(projects);
  } catch (err) {
    console.error('getProjects error:', err.message);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message });
  }
};

const getProjectByIdHandler = async (req, res) => {
  try {
    const project = await getProjectByIdForUser(req.params.id, req.user);
    res.status(200).json(project);
  } catch (err) {
    console.error('getProjectById error:', err.message);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message });
  }
};

module.exports = {
  createProject: createProjectHandler,
  getProjects: getProjectsHandler,
  getProjectById: getProjectByIdHandler,
};
