const express = require("express");
const app = express();
const morgan = require("morgan");
require("dotenv").config();
const connectDB = require("./config/database");
const mainRoutes = require("./routes/register");
const authRoutes = require("./routes/auth")
const applicationRoutes = require("./routes/application")
const grantRoutes = require("./routes/grants");

const PORT = process.env.PORT || 5000;


app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.json())

connectDB();

app.use(morgan("tiny"));


//Routes
app.use("/api", mainRoutes);
app.use("/api/login", authRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/grants", grantRoutes);

app.listen(PORT, () =>
    console.log(`Server Runing on https://localhost:${PORT}`)
);