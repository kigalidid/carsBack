const {Router} = require('express')
const UserController = require('../controller/UserController')
const {UserRequiredLogin} =require("../middleware/required")

const router = Router()

router.post("/registerCar",UserRequiredLogin,UserController.registerCar)
router.post('/registerDriver',UserRequiredLogin,UserController.registerDriver)
router.post("/recordInformation",UserRequiredLogin,UserController.recordInformation)


module.exports = router