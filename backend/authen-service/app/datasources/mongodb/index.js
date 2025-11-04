const mongoose = require('mongoose');
const config = require('../../config'); // Đường dẫn này tùy thuộc vào cách bạn export url
const models = require('./models')

const connectMongoDB = async () => {

    console.log("check db: ", config);
  try {
    await mongoose.connect(config.database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = {
  connectMongoDB,
  ...models
};