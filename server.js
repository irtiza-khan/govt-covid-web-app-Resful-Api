const express = require("express");
const app = express();
const morgan = require("morgan");
require("dotenv").config();
const connectDB = require("./config/database");
const mainRoutes = require("./routes/register");

const PORT = process.env.PORT || 5000;


app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.json())

connectDB();

app.use(morgan("tiny"));

app.use("/api", mainRoutes);

app.listen(PORT, () =>
    console.log(`Server Runing on https://localhost:${PORT}`)
);