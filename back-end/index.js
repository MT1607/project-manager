import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes/index.js';
dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.FE_URL,
    allowedHeaders: ['Content-Type', "Authorization"],
}));
app.use(morgan('combine'));

//connect db
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{console.log('MongoDB Connected')})
    .catch((err)=>{console.log("Failed connect to DB:", err)});

app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).json({
        message: "Welcome to the API PRM!",
    })
})

// localhost:5000/api-v1
app.use("/api-v1", routes);

//error middleware
app.use((err,req, res, next) => {
    console.log("error: ", err);
    res.status(500).json({message: "Internal Server Error"})
})

//not found middleware
app.use(( req, res) => {
    res.status(404).json({message: "Not found"})
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})