 exports.getByUserHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
      throw new Error(`getByUser only accept GET method, you tried: ${event.httpMethod}`);
  }
  // All log statements are written to CloudWatch
  console.info('RECEIVED:', event);

  const username = event.pathParameters.username;

  const response = {
      statusCode: 200,
      body: JSON.stringify({
      message: `get by ${username}`
      })
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
