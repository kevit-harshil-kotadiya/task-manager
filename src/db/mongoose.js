 const mongoose = require('mongoose');

 mongoose.set('strictQuery', true);
 try{
 mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');
 }
 catch(e){
    console.log(e);
 }
//  const me = new User({
//     name:'Tom  ',
//     email:'Tom@gmail.com  ',
//     age:21,
//     password:'123456Pa'
//  })

//  me.save().then(()=>{
//     console.log(me);
//  }).catch((error)=>{
//     console.log('Error!',error);
//  })



// const task = new Task({
//     discription:'go to college',
// });

// task.save().then(()=>{
//     console.log(task);
// }).catch((error)=>{
//     console.log(error);
// })