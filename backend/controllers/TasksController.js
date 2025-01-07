const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const Task = require('../models/Task')
const ObjectID = require('mongodb').ObjectID


exports.tasks = async (req, res) => {
    const { userId } = req
    try {
        let tasks = await Task.find({userId: new ObjectID(userId)})
        let tasksResponse = tasks.map(task => {
            return {
                id: task._id.toString(),
                userId: task.userId.toString(),
                name: task.name,
                important: task.important,
                deadline: task.deadline,
                done: task.done,
                subtasks: task.subtasks,
            }
        })
        res.status(200).json(tasksResponse)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}


exports.addTask = async (req, res) => {
    const {userId} = req
    try {

        if (!req.body) throw new Error('body - pusto')
        if (!req.body.name) throw new Error('add task - pusto')

        let task = new Task({
            userId: userId,
            name: req.body.name,
            important: false,
            deadline: req.body.deadline ? new Date(req.body.deadline) : '',
            done: false,
            subtasks: req.body.subtasks? req.body.subtasks : '',
        })

        const result = await task.save()

        if (result && result._id) {
            res.set('Access-Control-Expose-Headers', 'X-Custom-Header')
            res.set('X-Custom-Header', result._id.toString())
        }

        res.status(200).json()

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}



exports.updateTask = async (req, res) => {

    const taskId = req.query._id

    try {

        if(!req.body) throw new Error('body empty')

        await Task.updateOne({
            _id: new ObjectID(taskId),
            userId: new ObjectID(req.body.userId)
        }, {
            $set: {
                name: req.body.name,
                deadline: req.body.deadline ? new Date(req.body.deadline) : '',
                done: req.body.done,
                subtasks: req.body.subtasks
            } 
        })

        res.status(200).json()

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}



exports.deleteTask = async (req, res) => {

    const taskId = req.query._id

    try {

        await Task.deleteOne({_id: new ObjectID(taskId)})
        res.status(200).json()

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}



exports.deleteAll = async (req, res) => {

    const {userId} = req

    try {

        await Task.deleteMany({userId: new ObjectID(userId)})
        res.status(200).json()

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}



exports.deleteAllDone = async (req, res) => {

    const {userId} = req

    try {

        await Task.deleteMany({
            userId: new ObjectID(userId),
            done: true
        })
        res.status(200).json()

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}



exports.markAsDone = async (req, res) => {

    const {userId} = req
    const taskId = req.query._id

    try {

        if(!req.body.hasOwnProperty('done')) {
            throw new Error('body empty')
        }

        await Task.updateOne({
            _id: new ObjectID(taskId),
            userId: new ObjectID(userId)
        }, {
            $set: { done: req.body.done }
        })

        res.status(200).json()

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}



exports.markAsImportant = async (req, res) => {

    const {userId} = req
    const taskId = req.query._id

    try {

        if(!req.body.hasOwnProperty('important')) {
            throw new Error('body empty')
        }

        await Task.updateOne({
            _id: new ObjectID(taskId),
            userId: new ObjectID(userId)
        }, {
            $set: { important: req.body.important }
        })

        res.status(200).json()

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}


exports.updateSubtasks = async (req, res) => {

    const {userId} = req
    const taskId = req.query._id

    try {

        if (!req.body || !req.body.hasOwnProperty('subtasks')) {
            throw new Error('body empty')
        } 

        let a = await Task.updateOne({
            _id: new ObjectID(taskId),
            userId: new ObjectID(userId)
        }, {
            $set: { subtasks: req.body.subtasks }
        })

        res.status(200).json()

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}



exports.reorder = async (req, res) => {

    const {userId} = req

    try {

        if (!req.body || !req.body.hasOwnProperty('tasks')) {
            throw new Error('body pusto')
        } 

        let newTasks = req.body.tasks

        await Task.deleteMany({userId: new ObjectID(userId)})

        newTasks.forEach(task => delete task.id)

        await Task.insertMany(newTasks)
        
        res.status(200).json()

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}


exports.taskValidate = [
    check('name').isLength({max: 100}).withMessage('Maksymalnie 100 znaków')
]


exports.checkValidation = (req, res, next) => {
    const errors = validationResult(req) 
    if (!errors.isEmpty()) return res.status(400).json({message: errors.errors.pop().msg})
    next()
}