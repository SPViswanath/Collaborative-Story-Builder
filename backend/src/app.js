//imports
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const cors= require("cors");
const testRoutes = require("./routes/testRoutes");
const storyRoutes = require("./routes/storyRoutes");
const chapterRoutes = require("./routes/chapterRoutes");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

/*
    Middleware section
*/
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/chapters", chapterRoutes);

/*
test route
*/
app.use("/api/test", testRoutes);

app.get("/",(req,res)=>{
    res.send("site is running");
});

module.exports = app;
