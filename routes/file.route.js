const router = require('express').Router();
const multer = require('multer');
const { v4: uuid4}  = require('uuid');
const path = require('path');
const File = require('../models/model');

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename : (req, file, cb) => {
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        cb(null,fileName);
    }
})

let upload = multer({
    storage,
    limit: {fileSize : 100000 * 100}
}).single('file');

router.post('/', (req, res) => {
    //store file
    upload( req, res, async (err) => {
        //validate
        if(!req.file){
            res.json({error : 'all fields required'})
        }

        if(err){
            res.status(500).send({error: err.message});
        }
        // storage in to db
        const file = new File({
            filename : req.file.filename,
            path : req.file.path,
            size : req.file.size,
            uuid : uuid4(),
        })
        const response =  await file.save();

        return res.json({file : `${process.env.APP_BASE_URL}/files/${response.uuid}`});
    } )
})

router.post('/send', async (req, res) => {
  const {uuid, emailTo, emailFrom } = req.body;
  
  if( !uuid ||!emailTo || !emailFrom ){
      return res.status(422).send({error : 'all fields are required'});
  }

  //get data from database
  const file = await File.findOne({uuid:uuid});

  if(file.sender){
      return res.status(422).send({error : 'email already sent'});
  }

  file.sender = emailFrom;
  file.reciever = emailTo;

  const response = await file.save();

  //send mail
  const sendMail = require('../services/sendEmail');

  sendMail({
    from : emailFrom,
    to : emailTo, 
    subject : 'inshare file sharing made easy', 
    text : `${emailFrom} shared a file with you`, 
    html : require('../services/emailTemplate')({
        emailFrom : emailFrom,
        downloadLink : `${process.env.APP_BASE_URL}/files/${file.uuid}`, 
        size : parseInt(file.size/1000)+'KB', 
        expires: '24 hr'
    })
  })

})


module.exports = router;