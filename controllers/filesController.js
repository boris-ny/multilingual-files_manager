const fs = require('fs-extra');
const path = require('path');
const User = require('../models/user.model');
const File = require('../models/files.model');

// Upload a file
const uploadFile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const file = await File.create({
      originalName: req.file.originalname,
      size: req.file.size,
      filename: req.file.filename,
      filepath: req.file.path,
      userId: user.id,
    });

    res.status(201).json({ message: 'File uploaded successfully', file });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Files error' });
  }
};

const readAllFilesFromUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const files = await File.findAll({
      where: { userId: userId },
    });

    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'No files found for the user' });
    }

    res.status(200).json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Files error' });
  }
};

// Read a file
const readFile = async (req, res, next) => {
  try {
    const file = await File.findOne({
      where: { filename: req.params.filename },
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.sendFile(path.resolve(file.filepath));
  } catch (err) {
    next(err);
  }
};

// Update a file
const updateFile = async (req, res, next) => {
  try {
    const file = await File.findOne({
      where: { filename: req.params.filename, userId: req.body.userId },
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const oldFilePath = file.filepath;
    await fs.remove(oldFilePath, (err) => {
      if (err) {
        console.error(err);
      }
      console.log('Old file removed successfully');
    });

    file.filename = req.file.filename;
    file.filepath = req.file.path;
    file.originalName = req.file.originalname;
    file.size = req.file.size;
    await file.save();

    res.status(200).json({ message: 'File updated successfully', file });
  } catch (err) {
    console.error(err);
  }
};

// Delete a file
const deleteFile = async (req, res, next) => {
  try {
    const file = await File.findOne({
      where: { filename: req.params.filename },
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    await fs.remove(file.filepath, (err) => {
      if (err) {
        console.error(err);
      }
      console.log('File removed successfully');
    });
    await file.destroy();

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadFile,
  readFile,
  updateFile,
  deleteFile,
  readAllFilesFromUser,
};
