const mongoose = require('mongoose');

// db connection params
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}

const connectDb = () => {
    mongoose.connect(process.env.MONGO_CONNECTION_URL, connectionParams , (error) => {
        if(!error){
            console.log('db connected')
        }else{
            console.log('connection failed', error);
        }
    });
}

module.exports = connectDb 