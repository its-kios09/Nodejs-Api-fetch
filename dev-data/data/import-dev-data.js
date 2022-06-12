const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../Model/TourModel');
const Review = require('./../../Model/ReviewModel');
const User = require('./../../Model/UserModel');


dotenv.config({ path: './config.env' });


const database_url = process.env.DATABASE_LOCAL;

mongoose.connect(database_url,{
  useNewUrlParser:true,
  
}).then(()=> console.log("Natours Database Connnected succesfully..."));

//READ FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));

//IMPORT DATA INTO DATABASE
const importData = async () =>{
    try{
        await Tour.create(tours);
        await User.create(users,{ validateBeforeSave: false });
        await Review.create(reviews);
        console.log('DATA SUCCESSFULLY LOADED TO THE DATABASE');
        process.exit();
    }
    catch(err)
    {
        console.log(err);
    }

};
const deleteData = async () => {
    try{
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();

        console.log('DATA SUCCESSFULLY DELETED FROM THE DATABASE');
        process.exit();
    }
    catch(err)
    {
        console.log(err);
    }

};
if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData();
}
