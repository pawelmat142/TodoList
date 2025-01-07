const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/User')
const jwtExpireTime = '1 day'


exports.jwtAuthorization = (req, res, next) => {

    let token = req.headers['authorization'] 

    if (!token) 
        return res.sendStatus(401)

    jwt.verify(token.split(' ').pop(), process.env.ACCESS_TOKEN, (err, data) => {
        if (err) 
            return res.sendStatus(403)
        req.userId = data.id
        next()
    })
}

exports.register = async (req, res) => {
    try {
        if (!req.body.nickname) throw new Error('nickname puste')

        const nicknameExists = await User.find({nickname: req.body.nickname})
        if (nicknameExists.pop()) throw new Error('Nick jest już zajęty')

        if (!req.body.password) throw new Error('password puste')
        const salt = bcrypt.genSaltSync(parseInt(process.env.TODO_SALT))
        const hash = bcrypt.hashSync(req.body.password, salt)

        const user = new User({
            nickname: req.body.nickname,
            password: hash,
            email: req.body.email ? req.body.email : ''
        })

        const result = await user.save()
        if (result && result._id) {
            res.set('Access-Control-Expose-Headers', 'X-Custom-Header')
            res.setHeader('X-Custom-Header', result._id.toString())
        }
        res.status(200).json()

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}


exports.login = async (req, res) => {
    try {
        if (!req.body.nickname) throw new Error('nickname puste')
        let user = await User.findOne({nickname: req.body.nickname})

        if (!user) throw new Error('Nie ma takiego użytkownika')

        const isPasswordOk = bcrypt.compareSync(req.body.password, user.password)
        if (!isPasswordOk) throw new Error('Błędne hasło')

        // JWT TOKEN SET NEVER EXPIRES
        const token = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN)
        // const token = jwt.sign({id: user.id}, process.env.ACCESS_TOKEN, {expiresIn: jwtExpireTime})
        res.status(200).json(token)

    } catch (error) { 
        console.log(error)
        res.status(500).json({message: error.message})
    }
}



exports.registerValidate = [
    check('nickname').trim().isLength({min: 4, max: 20}).withMessage('Nick musi zawierac miedzy 4 a 20 znakow'),
    check('password').trim().isLength({min: 4, max: 60}).withMessage('Hasło musi zawierac miedzy 4 a 60 znakow'),
    check('confirmPassword').custom((value,{req}) => value === req.body.password ).withMessage('Powtórz to samo hasło!'),
    check('email').isLength({max: 60})
]

exports.loginValidate = [
    check('nickname').trim().isLength({min: 4, max: 20}).withMessage('Nick musi zawierac miedzy 4 a 20 znakow'),
    check('password').trim().isLength({min: 4, max: 60}).withMessage('Hasło musi zawierac miedzy 4 a 60 znakow'),
]

exports.checkValidation = (req, res, next) => {
    const errors = validationResult(req) 
    if (!errors.isEmpty()) return res.status(400).json({message: errors.errors.pop().msg})
    next()
}


//     // password validation
//     check('password').trim().notEmpty().withMessage('Password required')
//     .isLength({ min: 5 }).withMessage('password must be minimum 5 length')
//     .matches(/(?=.*?[A-Z])/).withMessage('At least one Uppercase')
//     .matches(/(?=.*?[a-z])/).withMessage('At least one Lowercase')
//     .matches(/(?=.*?[0-9])/).withMessage('At least one Number')
//     .matches(/(?=.*?[#?!@$%^&*-])/).withMessage('At least one special character')
//     .not().matches(/^$|\s+/).withMessage('White space not allowed'),
  


