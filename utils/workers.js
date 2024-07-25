const fs = require('fs-extra');
const File = require('../models/files.model');
const fileQueue = require('./queue');

fileQueue.process('upload', async (job, done) => {
  try {
    const { userId, filename, filepath, originalName, size } = job.data;

    const file = await File.create({
      originalName,
      size,
      filename,
      filepath,
      userId,
    });

    job.progress(100);
    done(null, file);
  } catch (err) {
    done(err);
  }
});

fileQueue.process('update', async (job, done) => {
  try {
    const {
      fileId,
      newFilename,
      newFilepath,
      oldFilepath,
      newOriginalName,
      newSize,
    } = job.data;

    await fs.remove(oldFilepath, (err) => {
      if (err) {
        console.error(err);
      }
      console.log('Old file removed successfully');
    });

    const file = await File.findByPk(fileId);
    file.filename = newFilename;
    file.filepath = newFilepath;
    file.originalName = newOriginalName;
    file.size = newSize;
    await file.save();

    job.progress(100);
    done(null, file);
  } catch (err) {
    done(err);
  }
});

fileQueue.process('delete', async (job, done) => {
  try {
    const { fileId, filepath } = job.data;
    // Simulate progress tracking
    job.progress(25);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate some work

    job.progress(50);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate some more work

    job.progress(75);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate even more work

    await fs.remove(filepath, (err) => {
      if (err) {
        console.error(err);
      }
      console.log('File removed successfully');
    });

    const file = await File.findByPk(fileId);
    await file.destroy();

    job.progress(100);
    done(null, { message: 'File deleted successfully' });
  } catch (err) {
    done(err);
  }
});

fileQueue.on('completed', (job, result) => {
  console.log(`Job completed with result: ${result}`);
});

fileQueue.on('failed', (job, err) => {
  console.log(`Job failed with error: ${err}`);
});
