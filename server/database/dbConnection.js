import mongoose from 'mongoose';


// Database connection function

export const connection = () => {
    mongoose
    .connect(process.env.MONGO_URL, {
        dbName : "MERN_AUTHENTICATION",
    })
    .then(()=>{
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log(`Some error occured while connecting to databse : ${err}`)
    })
}