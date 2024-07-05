import mongoose,{Schema} from "mongoose";

const db=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected");
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

export default db;