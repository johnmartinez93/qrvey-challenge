const { performance } = require('perf_hooks');

const AWS = require('aws-sdk');

const { getItem, updateItem } = require("../services/dynamodb");
const { putImages } = require("../services/s3");
const { transformImage } = require("../utils/editImage");

const sqsClient = new AWS.SQS();

const queueUrl = process.env.QUEUE_URL;

exports.processImageListHandler = async (event) => {
    const { body } = event.Records[0];
    const { requestId } = JSON.parse(body);

    try {
        const imageList = await getItem(requestId);

        let imagesUploadPromise = [];
        let iteratorImage = 0;
        let executionTime = performance.now();

        do {
            imagesUploadPromise.push(new Promise(async (resolve, reject) => {
                try {
                    const { grayscale, sepia, blur } = await transformImage(imageList[iteratorImage].url);
                    const item = imageList[iteratorImage]['id']
                    console.log(item)
                    await putImages(imageList[iteratorImage].id, requestId, { grayscale, sepia, blur });

                    await updateItem(imageList[iteratorImage].id);

                    resolve('done');
                } catch (error) {
                    console.log(JSON.stringify({ message: error.message }));
                    reject('fail');
                }
            }))

            iteratorImage++;
            executionTime = performance.now();
        } while (executionTime < 800000 && iteratorImage < imageList.length)

        await Promise.all(imagesUploadPromise);

        if (iteratorImage < imageList.length - 1) {
            await sqsClient.sendMessage({
                QueueUrl: queueUrl,
                MessageBody: JSON.stringify({
                    requestId
                })
            }).promise();
        } else {
            // compress
        }

        return;
    } catch (error) {
        console.log(JSON.stringify({ message: error.message }));
    }
};
