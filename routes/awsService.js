import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";   
import express from "express"
import dotenv from "dotenv";
dotenv.config();

const router = express.Router()

const s3 = new AWS.S3({
    accessKeyId:process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        // bucket - WE CAN PASS SUB FOLDER NAME ALSO LIKE 'bucket-name/sub-folder1'
        bucket: 'medicare-booking',
        // META DATA FOR PUTTING FIELD NAME
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        // SET / MODIFY ORIGINAL FILE NAME
        key: function (req, file, cb) {
            cb(null, file.originalname); //set unique file name if you wise using Date.toISOString()
            // EXAMPLE 1
            // cb(null, Date.now() + '-' + file.originalname);
            // EXAMPLE 2
            // cb(null, new Date().toISOString() + '-' + file.originalname);

        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
    }
})

router.post('/upload', function (req, res, next) {
    try {
        const file = req.body.file.toString();
        if(file){
            const params = {
                ACL: "public-read",
                Bucket: "medicare-booking",
                Key: req.body.fileName,
                Body: Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), 'base64')
            }
            s3.upload(params, (err, data)=> {
                if(err){
                    console.log("error 1 => ", err);
                    return res.status(400).json({success: false, data:req.file});
                }else{
                    console.log("Data => ", data);
                    return res.status(200).json({success: true, data:data});
                }
            })
        }else{
            console.log("error => no body found");
            return res.status(400).json({success: false, data:"Failed to upload"});
        }
        
    } catch (error) {
        console.log("error => ", error);
        return res.status(200).json({success: false, data:"Failed to upload"});
    }
    
    
});

const createBucket = async(bucketName, cb)=>{
    s3.createBucket({Bucket: bucketName},(err, data)=>{
        if(err){
            return cb("error", err);
        }else{
            return cb("ok", data.Location);
        }
    })
}

export default router;