import express from "express";
import dbConnect from "./db/index.js";
import { loginUser, registerUser } from "./controllers/user.controller.js";

const app = express();
import dotenv from "dotenv"

dotenv.config()


dbConnect().then(() => {
    console.log("MongoDB Connected#2");
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/v1/register',registerUser);
app.post('/api/v1/login',loginUser);

app.listen(5000, () => {
    console.log("server is running on port 5000");
});


