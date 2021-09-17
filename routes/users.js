const express = require("express");
const router = express.Router();
const multer = require("multer");
const users = require("../controllers/users");
const auth = require("../middleware/auth");
require("dotenv").config();

let storage = multer.diskStorage({
  destination: "images",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let upload = multer({ storage: storage });

router.post("/register", users.register);
router.post("/login", users.login);
router.post("/address", auth, users.saveAddress);
router.put("/delete", auth, users.deleteUser);
router.post("/upload", auth, upload.single("image", users.localUpload));
router.post("/online_upload", auth, users.uploadOnline);
module.exports = router;
