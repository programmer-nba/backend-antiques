var jwt = require("jsonwebtoken");
const NodeWebcam = require('node-webcam');
const fs = require('fs')
const { google, GoogleApis } = require("googleapis");
const GOOGLE_API_FOLDER_ID = 'googledrive@antiques-image.iam.gserviceaccount.com'

var Category = require("../models/antiques/antiques_category.model");
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

module.exports.TestCamera = async (req,res) => {
    try{
      // console.log('Request URL:', apiUrl);
// console.log('Headers:', headers);
      const auth = new google.auth.GoogleAuth({
        keyFile: '../backend-antiques-nba2/googlekey.json',
        scope: ['http://www.googleapis.com/auth/drive']
      })

      const driveService = google.drive({
        version: 'v3',
        auth
      })

      const fileMetaData = {
        'name': 'testuploadimgae01',
        'parent': [GOOGLE_API_FOLDER_ID]
      }

      const media = {
        mineType: 'image/jpf',
        // body: fs.createReadStream(path.join(__dirname, '..', 'backend-antiques-nba2','output.jpg'))
        body: fs.createReadStream('../backend-antiques-nba2/output.jpg')
      }

      const response = await driveService.files.create({
        resource: fileMetaData,
        media: media,
        field: 'id'
      })
      console.log("chkdataUpload")
      console.log(GoogleAuth)
      return res.status(200).send({message:"Upload Success", data: response.data.id})
        // const webcam = NodeWebcam.create({
        //     width: 1280,
        //     height: 720,
        //     quality: 100,
        //     output: 'jpeg',
        //     device: false,
        //     callbackReturn: 'location',
        //   });
          
        //   // Take a picture and save it to the specified location
        //   webcam.capture('output', (err, data) => {
        //     if (err) {
        //       console.error(err);
        //     } else {
        //       console.log('Image captured:', data);
        //     }
        //   });
      // return res.status(200).send({message:"Upload Success"})
    }catch(error){
      return res.status(500).send({message: "Upload File Error", error: error.message})
    }
}



