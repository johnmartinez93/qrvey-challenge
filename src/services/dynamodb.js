const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();

const TableName = process.env.TABLE_NAME;

exports.getItem = async (requestId) => {
    const params = {
        TableName: TableName,
        IndexName: "request-index",
        KeyConditionExpression: "requestId = :rid",
        FilterExpression: "isProcessed = :ipd",
        ExpressionAttributeValues: {
            ":rid": requestId,
            ":ipd": false,
        },
    };

    try {
        const { Items } = await docClient.query(params).promise();

        return Items;
    } catch (error) {
        console.log('getItem error: ', error.message)
    }
};

exports.updateItem = async (id) => {
    const params = {
        TableName: TableName,
        Key: { id },
        UpdateExpression: 'set isProcessed = :ipd',
        ExpressionAttributeValues: {
            ':ipd': true,
        }
    };

    try {
        await docClient.update(params).promise();
    } catch (error) {
        console.log('updateItem error: ', error.message)
    }
};
