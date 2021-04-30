 exports.putThoughtHandler = async (event) => {
  if (event.httpMethod !== 'POST') {
      throw new Error(`putThought only accept POST method, you tried: ${event.httpMethod}`);
  }
  // All log statements are written to CloudWatch
  console.info('RECEIVED:', event);

  const response = {
      statusCode: 200,
      body: JSON.stringify({
      message: 'put thought'
      })
  };

  // All log statements are written to CloudWatch
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
