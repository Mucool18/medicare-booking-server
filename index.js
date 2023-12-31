import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import userRouter from "./routes/user.js";
import doctorRouter from "./routes/doctor.js";
import reviewRouter from "./routes/review.js";
import awsServiceRouter from "./routes/awsService.js";
import bodyParser from "body-parser";
dotenv.config();
const app = express();
const port = process.env.PORT || 8010;

const corsOptions = {
    origin: true
}


///// database   ///////

mongoose.set("strictQuery", false);

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("mongodb database connected");
    } catch (error) {
        console.log("databse connection failed")
    }
}

///// middleware  ////////
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/doctors', doctorRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/awsService', awsServiceRouter);

app.listen(port, ()=>{
    connectDB();
    console.log(`listening on port ${port}`);
})