require('../src/db/mongoose')

const Task = require('../src/models/task');
const { count } = require('../src/models/user');

// Task.findByIdAndDelete('').then((task)=>{
//     console.log(task);
//     return Task.countDocuments({completed: false});
// }).then((result)=>{
//     console.log(result);
// }).catch((e)=>{
//     console.log(e);
// })

const deleteTaskandCount = async(id)=>{
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed:false});
    return count;
}

deleteTaskandCount("64fff2a82ecd7f5c8d7de895").then((count)=>{
    console.log(count);
}).catch((e)=>{
    console.log(e);
})