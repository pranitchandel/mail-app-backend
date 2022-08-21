const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const passport = require("passport");
const dotenv = require("dotenv");
const users = require("./routes/api/users");
const messages = require("./routes/api/messages");
const app = express();

connectDB();
dotenv.config();
app.use(cors());
app.use(express.json());

//Passport middleware
app.use(passport.initialize());

//Passport config
require("./config/passport")(passport);

app.use("/api/users", users);
app.use("/api/messages", messages);

const port = process.env.port || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
