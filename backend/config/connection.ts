import mongoose from 'mongoose';

if (process.env.MONGO)

mongoose.connect(process.env.MONGO);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected to MongoDB!")
});

export default db;
