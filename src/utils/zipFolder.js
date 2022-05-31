const s3Zip = require('s3-zip')

const Region = process.env.REGION

exports.compressFolder = async (requestId, files) => {
    try {
        const body = s3Zip.archive({ region: Region, bucket: 'compressImages' }, requestId, files)
        const zipParams = { params: { Bucket: 'compressImages', Key: requestId } }
        const zipFile = new AWS.S3(zipParams)
        zipFile.upload({ Body: body })
            .on('httpUploadProgress', function (evt) { console.log(evt) })
            .send(function (e, r) {
                if (e) {
                    const err = 'zipFile.upload error ' + e
                    console.log(err)
                    context.fail(err)
                }
                console.log(r)
            })
    } catch (e) {
        console.log('catched error: ' + e)
    }
}