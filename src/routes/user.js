const { Router } = require('express');
const UserController = require('../controller/UserController');
const { UserRequiredLogin } = require("../middleware/required");

const router = Router();

router.post("/registerCar", UserRequiredLogin, UserController.registerCar);
router.post('/registerDriver', UserRequiredLogin, UserController.registerDriver);
router.post("/recordInformation", UserRequiredLogin, UserController.recordInformation);
router.get("/allCars", UserRequiredLogin, UserController.Viewcars);
router.get("/allDrivers", UserRequiredLogin, UserController.Viewdrivers);
router.get("/allIncome", UserRequiredLogin, UserController.allIncome);
router.get("/allExpenses", UserRequiredLogin, UserController.allExpenses);
router.post("/search", UserRequiredLogin, UserController.searchDate);


module.exports = router;