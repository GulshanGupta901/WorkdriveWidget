/*
Copyright (c) 2017, ZOHO CORPORATION
License: MIT
*/
var fs = require('fs');
var path = require('path');
var express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
const multer = require('multer');
var morgan = require('morgan');
const FormData = require('form-data'); 
const axios = require('axios');

process.env.PWD = process.env.PWD || process.cwd();

const upload = multer({ dest: 'uploads/' });
var expressApp = express();
var port = process.env.PORT || 3000;
expressApp.use(cors());
expressApp.set('port', port);
expressApp.use(morgan('dev'));
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(errorHandler());


expressApp.use('/', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
let accessToken = '';
expressApp.post('/workdriveFile', async (req, res) => {
  try {
    accessToken = req.body.accessToken;
    console.log('Received data:', req.body); // Logs the parsed body
    const {data: pdf} = await axios({
      url: `https://download.zoho.com/v1/workdrive/download/${req.body.fileId}`,
      responseType: "arraybuffer",
      responseEncoding: "binary",
      headers: {
        "Content-Type": "application/pdf",
        'Authorization': `Zoho-oauthtoken ${req.body.accessToken}`
      }
  });
  const base64String = Buffer.from(pdf, 'binary').toString('base64')
  res.json({"base64String" : base64String});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

expressApp.post('/writerFile', async (req, res) => {
  try {
    console.log('Received data:', req.body); // Logs the parsed body
    const {data: pdf} = await axios({
      url: `https://www.zohoapis.com/writer/api/v1/documents/${req.body.fileId}?format=pdf`,
      responseType: "arraybuffer",
      responseEncoding: "binary",
      headers: {
        "Content-Type": "application/pdf",
        'Authorization': `Zoho-oauthtoken ${req.body.accessToken}`
      }
  });
  const base64String = Buffer.from(pdf, 'binary').toString('base64')
  res.json({"base64String" : base64String});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

expressApp.post("/upload", upload.single('file'), async (req, res) => {
 
  const parentId = req.body.parent_id;
console.log(req.file);
console.log(parentId);
if(req.file.size / (1024*1024)< 200){
  const formData = new FormData();
  formData.append('content', fs.createReadStream(req.file.path));
  formData.append('filename', req.file.originalname);
  formData.append('parent_id', parentId);
  formData.append('override-name-exist', 'true');
  // Create FormData
  // const form = new FormData();
  // form.append("filename", filename);
  // form.append("parent_id", parentId.trim());
  // form.append("override-name-exist", overrideNameExist);
  // form.append("content", fs.createReadStream(file.path));

  // Send request to Zoho WorkDrive
  const response = await axios.post("https://www.zohoapis.com/workdrive/api/v1/upload", formData, {
    headers: {
      ...formData.getHeaders(),
      Authorization: `Zoho-oauthtoken ${accessToken}`,
    },
  });
console.log(response.data.data[0].attributes.resource_id);
const requestBody = {
  data: {
    attributes: {
      resource_id: response.data.data[0].attributes.resource_id, 
      shared_type: "everyone",
      role_id: 34
    },
    type: "permissions"
  }
};
const externalSharing = await axios.post('https://www.zohoapis.com/workdrive/api/v1/permissions', requestBody, {
  headers: {
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json"
  },
});
console.log(externalSharing);
  res.json({"folderId" : response.data.data[0].attributes.resource_id});
}else{
  const formData = new FormData();
  formData.append('content', fs.createReadStream(file.path));
   console.log(formData.getHeaders());
   console.log(token);
  const response = await axios.post('https://upload.zoho.com/workdrive-api/v1/stream/upload', formData, {
      headers: {
          'Authorization': `Zoho-oauthtoken ${token}`,
          ...formData.getHeaders(), 
          'x-filename':req.body.fileName,
          'x-parent_id':parentId,
          'upload-id':parentId,
          'x-streammode':1
      },
  });
   console.log(`resource id::'+`, JSON.stringify(response.data));
 
  res.json({"Data" : response.data.data[0],"status_code":200});
}
  
})

expressApp.post('/uploadFileFromWorkdriveWidget', upload.single('file'), async (req, res) => {
  try {
    const maxFileSize = 10 * 1024 * 1024;
  console.log("file::"+req.file.size);
      const { file } = req;
      const parentId = req.body.parent_id; 
      const token = req.body.accessToken; 
      if(req.file.size / (1024*1024)< 200){
        console.log('token:: ',token);
        console.log('parentId:: ',req.body.fileName);
        const formData = new FormData();
        console.log(file.path);
        formData.append('content', fs.createReadStream(file.path));
        formData.append('filename', req.body.fileName);
        formData.append('parent_id', parentId.trim());
        formData.append('override-name-exist', 'false'); 
        console.log(...formData.getHeaders());
  
        const response = await axios.post('https://www.zohoapis.com/workdrive/api/v1/upload', formData, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${token}`,
                ...formData.getHeaders(), 
            },
        });
         console.log(`resource id::'+`, JSON.stringify(response.data));
       
        res.json({"Data" : response.data.data[0],"status_code":200});
      }else{
        const formData = new FormData();
        formData.append('content', fs.createReadStream(file.path));
         console.log(formData.getHeaders());
         console.log(token);
        const response = await axios.post('https://upload.zoho.com/workdrive-api/v1/stream/upload', formData, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${token}`,
                ...formData.getHeaders(), 
                'x-filename':req.body.fileName,
                'x-parent_id':parentId,
                'upload-id':parentId,
                'x-streammode':1
            },
        });
         console.log(`resource id::'+`, JSON.stringify(response.data));
       
        res.json({"Data" : response.data.data[0],"status_code":200});
      }
      
  } catch (error) {
    console.error("Error Message:", error.message); // Main error message
    if (error.response) {
        console.error("Response Status:", error.response.status);
        console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
    }
    if (error.config) {
        console.error("Request URL:", error.config.url);
        console.error("Request Headers:", JSON.stringify(error.config.headers, null, 2));
        console.error("Request Data:", JSON.stringify(error.config.data, null, 2));
    }
    console.error("Full Error Stack:", error.stack);
    
    res.status(500).json({ error: 'File upload failed', details: error.message });
} finally {
    if (req.file) {
        fs.unlinkSync(req.file.path);
    }
}
});

expressApp.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

