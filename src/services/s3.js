const AWS = require('aws-sdk');

const s3Client = new AWS.S3();

exports.putImages = async (id, requestId, { _transformedImageGrayscaleBuffer, _transformedImageSepiaBuffer, _transformedImageBlurBuffer }) => {
    console.log(id, requestId)
    try {
        await s3Client.putObject({
            Body: _transformedImageGrayscaleBuffer,
            Bucket: "testbucketqrvey",
            ContentType: 'image/png',
            Key: `${requestId}/${id}`
        }).promise();

        await s3Client.putObject({
            Body: _transformedImageSepiaBuffer,
            Bucket: "testbucketqrvey",
            ContentType: 'image/png',
            Key: `${requestId}/${id}`
        }).promise();

        await s3Client.putObject({
            Body: _transformedImageBlurBuffer,
            Bucket: "testbucketqrvey",
            ContentType: 'image/png',
            Key: `${requestId}/${id}`
        }).promise();
    } catch (error) {
        console.log('putImages error: ', error.message)
    }
}