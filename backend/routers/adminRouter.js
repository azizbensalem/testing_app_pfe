const router = require("express").Router();
const adminController = require("../controllers/adminController");
const { isAdmin } = require("../middlewares/Auth");

//register
router.post("/register", isAdmin, adminController.register);
//get all users
router.get("/all-users", isAdmin, adminController.getAllUsers);
//delete user by id
router.delete("/delete-user/:id", isAdmin, adminController.deleteUser);
//get the states of tests by user id
router.get("/get-status/:id", isAdmin, adminController.getTestStatePerUserId);
//get the states of tests by user id
router.get("/update-dataset", isAdmin, adminController.updateDataset);

module.exports = router;
