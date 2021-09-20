const express = require("express");
const bodyParser = require("body-parser");
const users = require("./routes/users");
// const fileupload = require("express-fileupload");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("dotenv").config();

app.use(express.json());
// app.use(fileupload({useTempFiles: true}));
app.use("/user", users);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));