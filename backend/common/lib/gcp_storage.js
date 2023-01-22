const {Storage} = require('@google-cloud/storage');
const Path = require('path');
const xlsx = require('xlsx');

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE_NAME,
});

exports.uploadImageToGcp = (request, fileName) =>{
  const bucket = storage.bucket('bucket_test_himanshu');
  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream();
  return new Promise((resolve, reject)=>{
    blobStream.on('finish', ()=>{
      resolve(true);
    });
    blobStream.end(request.file.buffer);
  });
};

exports.readXlsxFile = () =>{
  const excelEpoc = new Date(1900, 0, 0).getTime();
  const daysToMs = 86400000;

  const workbook = xlsx.readFile(Path.join(`${__dirname}`, '../public/xlsx/test.xlsx'));
  const worksheet = {};
  for (const sheetName of workbook.SheetNames) {
    worksheet[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }
  const newDate = new Date(excelEpoc + (worksheet['Sheet1'][2]?.['Due Date'] * daysToMs) );
  console.log(newDate);
};
