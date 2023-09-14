const express = require('express');
//this will run the mongoose.js file to initiate the connection

require('./db/mongoose') 
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');


const app = express();
const port = process.env.PORT || 3000;


// app.use((req,res,next)=>{

//     if(req.method === 'GET'){
//         res.send('GET requests are disabled');
//     }
//     else{
//         next();
//     }

// })

// app.use((req,res,next)=>{
//     res.status(503).send('Server under maintainance');
// })


app.use(express.json()); 
app.use(userRouter);
app.use(taskRouter);





 

app.listen(port,()=>{
    console.log('Server is up on port ' + port);
})