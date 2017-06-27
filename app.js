const express       = require("express")
const path          = require("path")
const AWS           = require("aws-sdk")
const fileUpload    = require("express-fileupload")
const fs            = require("fs")

const app           = express()
const port          = process.env.SANDBOX_PORT || 3000
const uploadsDir    = path.join(__dirname, "uploads")

app.set("view engine", "pug")

// Execute file upload middleware
app.use(fileUpload())


app.get("/", (req, res) => {

    return res.render("index", {
        title: "Node Js Uploader",
        message: "Hello World From the template"
    })

})

app.post("/upload", (req, res) => {

    if (!req.files) {
        return res.status(400).send("bruv, you didnt upload any files")
    }

    let myFile  = req.files.myfile

    myFile.mv(path.join(uploadsDir, myFile.name), err => {

        if (err) {
            return res.status(500).send(err)
        }

    return res.status(200).send("Thanks for uploading")

    })

})


// If directory does not exist, create it

app.listen(port, () => {

    try {

        fs.statSync(uploadsDir)

    } catch (e) {

        fs.mkdirSync(uploadsDir)

    }

    console.log(`Server listening on port ${port}`)
})

// Config AWS
// AWS.config.loadFromPath("./creds.json")

// const s3        = new AWS.S3()

// Create an s3 Bucket
// const myBucket  = {Bucket: "myBucket"}
// s3.createBucket(myBucket)
