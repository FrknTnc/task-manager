/**
 * @file Project.js
 * @description Proje koleksiyonu için Mongoose şema tanımı.
 * @module models/Project
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project must have a creator']
    }
  },
  {
    timestamps: true, // createdAt ve updatedAt otomatik eklenecek
    versionKey: false
  }
);

module.exports = mongoose.model('Project', projectSchema);
