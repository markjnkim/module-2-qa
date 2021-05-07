// Import the DynamoDB service
const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();
// Get the  table name from environment variable
const tableName = process.env.TABLE_NAME;

exports.getByUserHandler = async (event) => {
  // if (event.httpMethod !== "GET") {
  //   throw new Error(
  //     `getByUser only accept GET method, you tried: ${event.httpMethod}`
  //   );
  // }
  // All log statements are written to CloudWatch
  console.info("received:", event);

  const username = event.pathParameters.username.split('%20').join(' ');

  const params = {
    TableName: tableName,
    KeyConditionExpression: "#un = :user",
    ExpressionAttributeNames: {
      "#un": "username",
      "#ca": "createdAt",
      "#th": "thought",
    },
    ExpressionAttributeValues: {
      ":user": username,
    },
    ProjectionExpression: "#un, #th, #ca", 
    ScanIndexForward: false, // false makes the order descending(true is default)
  };
  
  const { Items } = await docClient.query(params).promise();
  // form the response
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    },
    body: JSON.stringify(Items),
  };

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );

  return response;
};
