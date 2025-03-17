import mongoose from "mongoose";

const connectToDatabase = ()=>{
    mongoose.connect(process.env.MONGODB_URL)
        .then(()=>{
            console.log("DB connection successful");
        })
        .catch((error)=>{
            console.log("DB connection failed");
            console.log(error);
            process.exit(1);
        })
}

export default connectToDatabase;