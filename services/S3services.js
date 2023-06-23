const AWS=require('aws-sdk');

const uploadToS3=(data, fileName) =>{

    try {
        const BUCKET_NAME = 'expense-tracking-report';
        const IAM_USER_KEY = process.env.AWS_ACCESS_KEY;
        const IAM_USER_SECRET = process.env.AWS_SECRET_KEY;

        let s3bucket = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET,
        })

        var params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: data,
            // Makes our file automatically public readable
            ACL: 'public-read'
        }
        return new Promise((resolve, reject) => {
            s3bucket.upload(params, (err, s3response) => {
                if (err) {
                    console.log('Something went wrong', err);
                    reject(err);
                } else {
                    // returning the file url
                    resolve(s3response.Location);
                }
            })
        })

    } catch (err) {
        return err;
    }
}

module.exports={
    uploadToS3
}
// djdjdjdjd