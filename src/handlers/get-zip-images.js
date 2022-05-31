const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

const TableName = process.env.TABLE_NAME;

exports.getZipImagesHandler = async (event) => {
    console.log(JSON.stringify(event))

    if (bodyParse && bodyParse.images.length !== 0) {
        try {
            //
        } catch (error) {
            //
        }
    } else {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Empty image list!' }),
        };
    }
};
