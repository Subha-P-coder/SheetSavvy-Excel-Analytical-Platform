 import mongoose from "mongoose";

 const connectDB = async () => {
    try{
        mongoose.connection.on('connected', ()=> console.log("Database Connected"));
        await mongoose.connect(`${process.env.MONGO_URI}/mern-excel`);
    }catch{err => console.error('DB error',err)};
 };

 export default connectDB;