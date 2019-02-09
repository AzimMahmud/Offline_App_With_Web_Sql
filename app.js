const express = require("express");
const app = express();
const http = require("http").Server(app);
const multer = require("multer");
const port = 4000;

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/uploads");
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({
    storage: storage
}).single("fileUpload");

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static(__dirname + "/public"));

app.post("/upload", (req, res) => {
    try {
        upload(req, res, function (err) {
            if (err) {
                return res.end("Error uploading file.");
            }
            res.redirect('/');
        });

    } catch (error) {
        console.log(error);
    }
});



http.listen(port, () => {
    console.log(`Server is running on ${port}`);
});