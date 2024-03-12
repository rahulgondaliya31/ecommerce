const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const file = require("./app/routes/file");
const mysql = require('mysql')
const socket = require("socket.io");
require("dotenv").config();

const app =express()
app.use(cors())
app.use(express.json())


global.nodeSiteUrl = 'http://192.168.1.121:4000';



  app.use(bodyParser.urlencoded({
      limit: "50mb",
      extended: false
    }));
    app.use(bodyParser.json({limit: "50mb"}));


  app.get("/", (req, res) => {
     res.send("hello world");
  });

  const users = require("./app/routes/users.js")(app)
  const contact = require("./app/routes/contact.js")(app)
  const products = require("./app/routes/products.js")(app)
  const category = require("./app/routes/category.js")(app)
  const page = require("./app/routes/page.js")(app)
  const message = require("./app/routes/message.js")(app)
  app.use("/file", file);


  const PORT = 4000;
 app.listen(PORT,"192.168.1.121", () => {
  console.log(`Server is running on port ${PORT}.`);
});	

// const io = socket(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true,
//   },
// });

// global.onlineUsers = new Map();
// io.on("connection", (socket) => {
//   global.chatSocket = socket;
//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//   });

//   socket.on("send-msg", (data) => {
//     // console.log(data); return false
//     const sendUserSocket = onlineUsers.get(data);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("msg-recieve", data.msg);
//     }
//   });
// });
