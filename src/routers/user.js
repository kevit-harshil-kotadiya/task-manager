const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

const {sendWelcomeEmail,sendCancelationEmail} = require('../emails/account');


router.post('/users', async (req, res) => {

    const user = new User(req.body)

    try {
        await user.save();

        sendWelcomeEmail(user.email,user.name);

        const token = await user.generateAuthToken();


        res.status(201).send({ user, token });
    }
    catch (e) {
        res.status(400).send(e);
    }

})


router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken()
        res.send({ user, token });
    }
    catch (e) {
        res.status(400).send();
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();

        res.send()
    }
    catch (e) {
        res.status(500).send();
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send();
    }
})


router.get('/users/me', auth, async (req, res) => {

    res.send(req.user);

})


// router.get('/users/:id',auth,async(req,res)=>{

//     const _id = req.params.id;
//     try{
//         const user = await User.findById(_id);
//         if(!user){
//             return res.status(404).send('no user found!');
//         }
//         res.send(user);
//     }
//     catch{
//         res.status(500).send('error featching user or Invalid ID');
//     }

// })

router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdate = ['name', 'email', 'password', 'age'];
    const isValiedOperation = updates.every((update) => allowedUpdate.includes(update))

    if (!isValiedOperation) {
        return res.status(400).send({ error: "Invalid Updates!" })
    }

    try {

        // const user = await User.findByIdAndUpdate(req.params.id,updateData,{new:true,runValidators:true})

        const user = req.user;

        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();



        res.send(user);
    }
    catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        //  const user = await User.findByIdAndDelete(req.user._id);
        //  res.send(user);

        sendCancelationEmail(req.user.email,req.user.name);
        console.log(req.user);
        await req.user.remove();
        res.send(req.user);
    }
    catch (e) {
        console.log(e);
        res.status(500).send();
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please Upload an image'));
        }
        cb(undefined, true);
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    const buffer = await sharp (req.file.buffer).resize({width:250,height:250}).png().toBuffer();

    //req.file is from multer middleware above
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
})

router.delete('/users/me/avatar', auth, async (req, res) => {
     req.user.avatar = undefined;
     await req.user.save();
     res.send();
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const  user = await User.findById(req.params.id);


        if(!user || !user.avatar){
            throw new Error();
        }

        res.set('Content-Type','image/jpg')
        res.send(user.avatar);
    }
    catch(e){
        res.status(404).send();
    }
})



module.exports = router;