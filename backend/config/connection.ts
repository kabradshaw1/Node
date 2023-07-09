import mongoose from 'mongoose';

const mongoUsernameAndPassword = process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD
    ? `${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@`
    : '';

let connectionString = `mongodb://${mongoUsernameAndPassword}${process.env.MONGO_HOST}:27017/${process.env.MONGO_DB_NAME}`;

if(mongoUsernameAndPassword){
    connectionString += '?authSource=admin';
}

mongoose.connect(connectionString);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected to MongoDB!")
});

export default db;
