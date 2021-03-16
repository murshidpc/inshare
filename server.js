const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3500 ;

//cors
app.use(cors()) 

// template
app.set('views', path.join(__dirname,'/views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//db connection
const connectDb = require('./config/db');
connectDb();

//routes
const FileRoute = require('./routes/file.route');
const ShowRoute = require('./routes/show.route');
const DownloadRoute = require('./routes/download.route');

app.use('/api/files' , FileRoute);
app.use('/files', ShowRoute);
app.use('/files/download', DownloadRoute);

app.listen( PORT , () => {
    console.log(` app listening on prot ${PORT}`)
})