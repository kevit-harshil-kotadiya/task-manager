const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task'); 



router.post('/tasks',auth,async(req,res)=>{
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save();
        res.status(201).send(task);
    }
    catch(e){
        res.status(400).send();
    }
})


router.get('/tasks',auth,async(req,res)=>{
   
    try{
        const tasks = await Task.find({owner:req.user._id});
        res.send(tasks);
    }
    catch(e){
        res.status(500).send();
    }
    
})


router.get('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id;


    try{
        // const task = await Task.findById(_id);

        const task = await Task.findOne({_id ,owner:req.user._id});

        if(!task){
            return res.status(404).send('no task found');
        }
        res.send(task);
    }
    catch(e){
        res.status(500).send('Error fetching task or Invalid ID');
    }

})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdate = ['discription','completed'];
    const isValiedOperation = updates.every((update)=>allowedUpdate.includes(update))
    if(!isValiedOperation){
        res.status(400).send({error:'Invalid Updates!'})
    }
    try{
        
        const task =  await Task.findOne({_id:req.params.id,owner:req.user._id});

        if(!task){
            return res.status(404).send();
        }

        updates.forEach((update)=>task[update]=req.body[update]);
        await task.save();
        res.send(task);
    }
    catch(e){
        res.status(400).send(e);
    }
})


router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});
        if(!task){
            res.status(404).send();
        }
        res.send(task);
    }
    catch(e){
        res.status(500).send();
    }
})

module.exports = router;