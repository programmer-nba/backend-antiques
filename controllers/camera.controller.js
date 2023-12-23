var jwt = require("jsonwebtoken");
const NodeWebcam = require('node-webcam');
const fs = require('fs')
const { google, GoogleApis } = require("googleapis");
const GOOGLE_API_FOLDER_ID = 'googledrive@antiques-image.iam.gserviceaccount.com'

var Category = require("../models/antiques/antiques_category.model");
const path = require("path");
// const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
const CLIENT_ID = '759885019891-2ic1iap7tr4mpb3ua2039clg0m5nu25t.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04jHjMeRGira4CgYIARAAGAQSNwF-L9Irmpdf5h6al53S2VocywVNBwnXXc8Zn-os1jSjA70c4Bmfv_WXmpSFx4_dqHauMXYV1y4'

const oauth2Cliend = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
)
oauth2Cliend.setCredentials({refresh_token: REFRESH_TOKEN})

const drive = google.drive({
  version: 'v3',
  auth: oauth2Cliend
})


var file = "https://cdn.vox-cdn.com/thumbor/e5CFA0qBt8mekbsbmvoU1fu93UM=/0x0:5123x3416/1200x800/filters:focal(2219x384:3037x1202)/cdn.vox-cdn.com/uploads/chorus_image/image/72509094/usa_today_19718400.0.jpg"
var filePath = path.join(__dirname, "../../2.jpg")
module.exports.Camera = async (req,res) => {
    try{
      
    console.log("req.body : ",req.body)
    // console.log(process.env.GOOGLE_DRIVE_REFRESH_TOKEN)
    const response = await drive.files.create({
      requestBody:{
        name: 'uploadimage2.jpg',
        mineType: 'image/jpg',
        role: 'reader',
        type: 'anyone'
      },
      media:{
        mineType: 'image/jpg',
        body: fs.createReadStream(filePath)
      },
      
        fields: 'id'
      
    })
    console.log("response : ", response)
    console.log("response data id : ", response.data.id)
    // console.log(response.data)
      // console.log('Request URL:', apiUrl);
// console.log('Headers:', header);
      // const auth = new google.auth.GoogleAuth({
      //   keyFile: '../backend-antiques-nba2/googlekey.json',
      //   scope: ['http://www.googleapis.com/auth/drive']
      // })

      // const driveService = google.drive({
      //   version: 'v3',
      //   auth
      // })

      // const fileMetaData = {
      //   'name': 'testuploadimgae01',
      //   'parent': [GOOGLE_API_FOLDER_ID]
      // }

      // const media = {
      //   mineType: 'image/jpf',
      //   // body: fs.createReadStream(path.join(__dirname, '..', 'backend-antiques-nba2','output.jpg'))
      //   body: fs.createReadStream('../backend-antiques-nba2/output.jpg')
      // }

      // const response = await driveService.files.create({
      //   resource: fileMetaData,
      //   media: media,
      //   field: 'id'
      // })
      const getImage = await drive.files.get()
      console.log("chkdataUpload")
      // console.log(GoogleAuth)
      return res.status(200).send({message:"Upload Success", data: response.data.id})
        const webcam = NodeWebcam.create({
            width: 1280,
            height: 720,
            quality: 100,
            output: 'jpeg',
            device: false,
            callbackReturn: 'location',
          });
          
          // Take a picture and save it to the specified location
          webcam.capture('output', (err, data) => {
            if (err) {
              console.error(err);
            } else {
              console.log('Image captured:', data);
            }
          });
      return res.status(200).send({message:"Upload Success"})
    }catch(error){
      return res.status(500).send({message: "Upload File Error", error: error.message})
    }
}

module.exports.ChkCamera = async (req, res) =>{
  try{

  }catch(error){
    return res.status(500).send({message: "Upload File Error", error: error.message})
  }
}

module.exports.GetImageFromDrive = async (req,res) => {
  try{
    const result = await drive.files.get({
      // fileId: "1Fw-2wv6ZOWFzpYpA-k_fEmLrwALrRVtU",
      // fields: "webViewLink, webContentLink",
    });
    return res.status(200).send({message: "Get Image Success", data: result})
  }catch(error){
    return res.status(500).send({message: "Upload File Error", error: error.message})
  }
}



