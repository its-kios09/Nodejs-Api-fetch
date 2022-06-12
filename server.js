const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');


const database_url = process.env.DATABASE_LOCAL;

mongoose.connect(database_url,{
  useNewUrlParser:true,
  
}).then(()=> console.log("Natours Database Connnected succesfully..."));


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Natours website is running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

