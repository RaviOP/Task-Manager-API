const express = require('express');
const Tasks = require('../models/tasks')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/tasks',auth,async(req,res)=> {
    // const tasks = new Tasks(req.body)
    const tasks = new Tasks({
        ...req.body,
        owner: req.user._id
    })
    try {
        await tasks.save()
        res.status(201).send(tasks)
    } catch (error) {
        res.status(400)
        res.send(error)
    }
})

//GET /tasks?completed=true/false
//GET /tasks?limit=3&skip=3
router.get('/tasks',auth,async(req,res)=>{
    const match = {}
    const sort = {}
    if (req.query.completed){
        match.completed= req.query.completed === 'true'
    }

    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'? -1:1
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            } 
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try {
        const tasks = await Tasks.findOne({_id,owner: req.user._id})
        if (!tasks){
            return res.status(404).send()
        }
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isVAlidOperation = updates.every((Update)=> allowedUpdates.includes(Update))

    if (!isVAlidOperation){
        return res.status(400).send({
            Error: 'Invalid Updates'
        })
    }
    try {
        const tasks = await Tasks.findOne({_id: req.params.id,owner: req.user._id})
        // const tasks = await Tasks.findByIdAndUpdate(req.params.id,req.body,{new: true,runValidators: true})
        if (!tasks) {
            return res.status(404).send()
        }
        updates.forEach((Update)=>{
            tasks[Update]=req.body[Update]
        })
        await tasks.save()
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id',auth,async (req,res)=>{
    try {
        const tasks = await Tasks.findOneAndDelete({_id: req.params.id,owner: req.user._id})
        if (!tasks){
            return res.status(404).send()
        }
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router