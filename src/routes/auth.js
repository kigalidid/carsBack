const { Router } = require('express');
const AuthController = require("../controller/authController");
const { AdminRequiredLogin } = require('../middleware/isAdmin');

const router = Router();

router.post("/register", AdminRequiredLogin, AuthController.register);
router.post('/login', AuthController.login);
router.post("/admin", AuthController.createAdmin);


module.exports = router;