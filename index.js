const http=require("http");
const express =require("express");
const cors = require("cors");
const socketIO = require("socket.io");


const app=express();
const port= 8000;
// const port= 8000;

app.use(cors());
app.get("/",(req, res)=>{
    res.send("server is working");
})
const server=http.createServer(app);
const io=socketIO(server);
var users=[];
var count=0;
io.on("connection",(socket)=>{
    
    socket.on('user-joined', ({userName })=>{
       
      users[socket.id]=userName;
      if (count <=0) {
        socket.emit('welcome', {user: 'admin', message:` Welcom to the chat, ${users[socket.id]}. No one is online except you`});
      }
      else{
        socket.emit('welcome', {user: 'admin', message:` Welcom to the chat, ${users[socket.id]}. Only ${count} users are online except you`});  
      }
      
      socket.broadcast.emit('sendall',  {user: 'admin', message:` ${users[socket.id]} has joined` });
      count++;
    });
    

    socket.on('disconnect', ()=>{
        count --;
        if (count<=-1) {
            count=0;
        }
        if (count-1<=0) {
            socket.broadcast.emit('leave', {user:'admin', message: `${users[socket.id]} left the chat room. No one is online except you`});
        } else {
            socket.broadcast.emit('leave', {user:'admin', message: `${users[socket.id]} left the chat room. Only ${count} users are online except you`});
        }
        
       
    });

    socket.on('processing-message', ({message , id})=>{
       io.emit('send-message', {user: users[id], message, id});
    });

});


server.listen(port,(e)=>{
    // http://localhost:8000
    console.log("server is working");
})