const express = require("express");
const fs = require("fs");
const os = require("os");
// const parser = require("xml2json");
// const parseString = require('xml2js').parseString;
const bodyParser = require("body-parser");
const multer = require("multer");
const AbbyyClient = require("./ocrsdk.js");

const app = express.Router();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static("./uploads"));
// app.use(express.static('dist'));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./uploads");
  },
  filename(req, file, callback) {
    callback(null, "test.jpg");
  }
});

const upload = multer({ storage }).single("userPhoto");
const client = new AbbyyClient("prash471TestApp", "0DFqo6ObjplvKoB/HJS/QTdV", "http://cloud.ocrsdk.com");

// country=japan&imageSource=auto&exportFormat=xml
// profile=textExtraction&imageSource=photo&language=English,Japanese&exportFormat=txt

app.get("/api/getUsername", (req, res) => res.send({ username: os.userInfo().username }));

// app.post('/api/getUserData', async (req, res) => {
//   console.log(req.body);
//   // const pic = req.body.picture;
//   client.processReceipt(
//     apiParameters,
//     '/Users/pk/projects2018/simple-react-full-stack/src/server/ReceiptJapan.jpg',
//     (err, result) => {
//       res.set({ 'content-type': 'application/json; charset=utf-8' });
//       const c = fs.readFile(result, (err, data) => {
//         res.send(err);
//       });
//     }
//   );
// });

app.post("/api/getUserData", (req, res) => {
  upload(req, res, err => {
    const apiParameters = {
      country: req.body.lang,
      exportFormat: "xml",
      imageSource: "auto"
    };
    if (err) {
      console.log(err);
      return res.end("Error uploading file.");
    }
    client.processReceipt(apiParameters, "./uploads/test.jpg", (err, result) => {
      res.set({ "content-type": "application/json; charset=utf-8" });
      const c = fs.readFile(result, (err, data) => {
        res.send(err);
      });
    });
  });
});

// app.listen(8080, () => console.log('Listening on port 8080!'));

module.exports = app;
