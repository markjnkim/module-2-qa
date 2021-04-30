 exports.getAllThoughtsHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
      throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
  }
  // All log statements are written to CloudWatch
  console.info('RECEIVED:', event);

  const response = {
      statusCode: 200,
      body: JSON.stringify({
      message: 'get all thoughts'
      })
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
