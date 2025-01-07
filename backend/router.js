const express = require('express')
const router = express.Router()

const usersController = require('./controllers/UsersController')
const tasksController = require('./controllers/TasksController')


router.post('/login',
    usersController.loginValidate,
    usersController.checkValidation,
    usersController.login
)

router.post('/register', 
    usersController.registerValidate, 
    usersController.checkValidation, 
    usersController.register
)

router.get('/tasks',
    usersController.jwtAuthorization,
    tasksController.tasks
)

router.post('/task',
    usersController.jwtAuthorization,
    tasksController.taskValidate,
    tasksController.checkValidation,
    tasksController.addTask
)


router.put('/task?:_id',
    usersController.jwtAuthorization,
    tasksController.taskValidate,
    tasksController.checkValidation,
    tasksController.updateTask
)


router.delete('/delete?:_id',
    usersController.jwtAuthorization,
    tasksController.deleteTask
)


router.delete('/del',
    usersController.jwtAuthorization,
    tasksController.deleteAll
)


router.delete('/deldone',
    usersController.jwtAuthorization,
    tasksController.deleteAllDone
)


router.patch('/done?:_id',
    usersController.jwtAuthorization,
    tasksController.markAsDone
)


router.patch('/important?:_id',
    usersController.jwtAuthorization,
    tasksController.markAsImportant
)


router.patch('/subtasks?:_id',
    usersController.jwtAuthorization,
    tasksController.updateSubtasks
)


router.post('/reorder',
    usersController.jwtAuthorization,
    tasksController.reorder
)


module.exports = router















