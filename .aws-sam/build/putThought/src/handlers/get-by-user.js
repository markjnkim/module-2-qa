// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE_NAME;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();

exports.getByUserHandler = async (event) => {
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getByUser only accept GET method, you tried: ${event.httpMethod}`
    );
  }
  // All log statements are written to CloudWatch
  console.info("received:", event);

  const username = event.pathParameters.username;
  console.info(username);

  const params = {
    TableName: tableName,
    KeyConditionExpression: "#un = :user",
    ExpressionAttributeNames: {
      "#un": "username",
      "#ca": "createdAt",
      "#th": "thought",
      //   "#img": "image"    // add the image attribute alias
    },
    ExpressionAttributeValues: {
      ":user": username,
    },
    ProjectionExpression: "#un, #th, #ca", // add the image to the database response
    ScanIndexForward: false, // false makes the order descending(true is default)
  };
  const data = await docClient.query(params).promise();
  const items = data.Items;
  // form the response
  const response = {
    statusCode: 200,
    body: JSON.stringify(items),
  };

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );

  return response;
};
