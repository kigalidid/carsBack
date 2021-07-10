const { Router } = require('express');
const AdminController = require('../controller/AdminController');

const { AdminRequiredLogin } = require('../middleware/isAdmin');


const router = Router();

router.get("/allUsers", AdminRequiredLogin, AdminController.getAllUsers);
router;


module.exports = router;