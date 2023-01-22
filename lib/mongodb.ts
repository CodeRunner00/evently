// mongodb.js

import mongoose from "mongoose";

const uri = `mongodb+srv://efor202:Coolio%401423@cluster0.teyvbej.mongodb.net/?retryWrites=true&w=majority`;
// const options = {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
// }

// mongoose.connect(
//   uri,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   }
// );

// console.log('intialized mongodb!!')

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error: "));
// db.once("open", function () {
//   console.log("Connected successfully - is it every time?? ");
// });

// export default db

module.exports = function () {
  return new Promise((res, rej) => {
    mongoose.connect(uri);
    const db = mongoose.connection;
    if (mongoose.connection.readyState == 1) res(true);
    console.log("db is ", db);
    db.on("error", function (err) {
      console.log("Failed to connect to database");
      rej();
    });

    db.once("open", function () {
      console.log("Connected to database");
      return res(true);
    });
  });
};
