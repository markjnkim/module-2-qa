// Create a DocumentClient that represents the query to add an item
const dynamodb = require("aws-sdk/clients/dynamodb");
const docClient = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables
const tableName = process.env.TABLE_NAME;

exports.putThoughtHandler = async (event) => {
  if (event.httpMethod !== "POST") {
    throw new Error(
      `putThought only accept POST method, you tried: ${event.httpMethod}`
    );
  }
  // All log statements are written to CloudWatch
  console.info("received:", event);

  // Get username and thought from the body of the request
  const body = JSON.parse(event.body);
  const { username, thought } = body;

  const params = {
    TableName: tableName,
    Item: { username: username, thought: thought, createdAt: Date.now() },
  };

  docClient.put(params).promise();

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
    },
    body: JSON.stringify(body),
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);

  return response;
};
