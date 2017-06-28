const express       = require("express")
const path          = require("path")
const AWS           = require("aws-sdk")
const fileUpload    = require("express-fileupload")
const fs            = require("fs")

const app           = express()
const port          = process.env.SANDBOX_PORT || 3000
const uploadsDir    = path.join(__dirname, "uploads")


// Config AWS
AWS.config.loadFromPath("./creds.json")

const myBucket      = new AWS.S3({params: { Bucket: process.env.S3_BUCKET }})

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
    let data    = { Key: myFile.name, Body: myFile.data }

    myBucket.putObject(data, (err, data) => {

        if (err) {
            console.error("Error Uploading File: ", data)
            return res.status(500).send("Error uploading file: " + data).end()
        }

        let urlParams = {Bucket: "zabanasandboxtest123", Key: myFile.name }

        myBucket.getSignedUrl("getObject", urlParams, (err, url) => {

            if (err) console.error("Couldn't retrieve url for this file")
            return res
                    .status(200)
                    .send("Thanks for uploading, heres the link: " + url)
        })

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
