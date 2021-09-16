const express = require("express");
const router = express.Router();
const users = require("../controllers/users");

router.post("/register", users.register);
router.post("/login", users.login);

module.exports = router;