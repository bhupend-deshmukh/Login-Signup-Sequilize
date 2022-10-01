const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { register, login, updateUser } = require('../controllers/users');


router.post("/register",register)
router.post("/login",login)
router.put("/update",auth.verifytoken,updateUser)


module.exports = router;