const dotenv = require('dotenv');
const mongoose = require('mongoose');

//UNCAUGHT EXCEPTION
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!!!!!     SHUTTING DOWN........');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });

const app = require('./app');

const encodedPassword = encodeURIComponent(process.env.DATABASE_PASSWORD);
const DB = process.env.DATABASE.replace('<password>', encodedPassword);

// const DB = process.env.DATABASE.replace(
//   '<password>',
//   process.env.DATABASE_PASSWORD,
// );
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then(() => {
//     console.log('db connection succesfull');
//   });
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

//4).START SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on ${port}`);
});

//UNHANDLED REJECTION
process.on('unhandledRejection', (err) => {
  console.log('UNHADLED REJECTION!!!!!    SHUTTING DOWN........');
  console.log(err, err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED.Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
