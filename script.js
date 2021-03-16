const connectDb = require('./config/db');
const fs = require('fs');
connectDb()

const File = require('./models/model');

// delete all file older than 24hr, this script will execute at 2pm of each day
const deleteData = async() => {

    const pastTimeStamp = new Date(Date.now()-24*60*60*1000)
    const files = await File.find({ createdAt :{$lt : pastTimeStamp}});
    
    if(files.length){
        for(const file of files){
            try{
                fs.unlinkSync(file.path)
                await file.remove()
                console.log(`succesfully deleted ${file}`)
            }catch(error){
                console.log(`error while deleting ${file}`)
            }
        }
    } 
    console.log('job done!');   
}

deleteData().then(process.exit);