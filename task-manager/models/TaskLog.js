/**
 * @file TaskLog.js
 * @description Görev değişiklik geçmişini tutan Mongoose şemasıdır.
 * @module models/TaskLog
 */

const mongoose = require('mongoose');

const taskLogSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task reference is required']
    },
    previousData: {
      type: Object,
      required: [true, 'Previous task data is required']
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Changed by user reference is required']
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('TaskLog', taskLogSchema);
