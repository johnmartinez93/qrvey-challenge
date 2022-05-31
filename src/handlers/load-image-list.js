const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const docClient = new AWS.DynamoDB.DocumentClient();
const sqsClient = new AWS.SQS();

const TableName = process.env.TABLE_NAME;
const Region = process.env.REGION;
const queueUrl = process.env.QUEUE_URL;

const checkImageURL = (url) => url.match(/\.(jpeg|jpg|gif|png)$/) != null;

exports.loadImageListHandler = async (event) => {
    console.log(JSON.stringify(event))

    const { body, requestContext: { apiId }} = event;
    let response;

    const bodyParse = JSON.parse(body);

    if (bodyParse && bodyParse.images.length !== 0) {
        try {
            imageURLs = bodyParse.images;

            if (!!imageURLs.find(url => !checkImageURL(url))) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: 'At least one url does not comply with the format' }),
                };
            }

            const requestId = uuidv4();
            const params = {
                RequestItems: {
                    [TableName]: imageURLs.map((url) =>(
                        {
                            PutRequest: {
                                Item: {
                                    id: uuidv4(),
                                    requestId,
                                    url,
                                    isProcessed: false,
                                    compress: false
                                },
                            },
                        })
                    ),
                },
            };

            await docClient.batchWrite(params).promise();

            await sqsClient.sendMessage({
                QueueUrl: queueUrl,
                MessageBody: JSON.stringify({
                    requestId
                })
            }).promise();

            const link = `https://${apiId}.execute-api.${Region}.amazonaws.com/Prod/${requestId}`

            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Download your images at the following link",
                    link
                }),
            };
        } catch (error) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: error.message }),
            };
        }
    } else {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Empty image list!' }),
        };
    }
};
