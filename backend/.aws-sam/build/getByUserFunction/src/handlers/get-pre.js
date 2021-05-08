const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();

// Change this value to adjust the signed URL's expiration
const URL_EXPIRATION_SECONDS = 300;
exports.getPreUrlHandler = async (event, context) => {
  console.log("REGION: ", process.env.AWS_REGION);
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: "get Pre URL",
  //   }),
  // };

  // return response;
  return await getUploadURL(event);
};

const getUploadURL = async function (event) {
  const randomID = parseInt(Math.random() * 10000000);
  const Key = `${randomID}.jpg`;

  // Get signed URL from S3
  const s3Params = {
    Bucket: process.env.UPLOAD_BUCKET,
    Key,
    Expires: URL_EXPIRATION_SECONDS,
    ContentType: "image/jpeg",
    // This ACL makes the uploaded object publicly readable.
    ACL: "public-read",
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);
  const response = {
    body: JSON.stringify({
      Key: Key,
      uploadURL: uploadURL,
    })
  };

  console.log("Params: ", s3Params);
  console.info("uploadURL: ", uploadURL);
  console.info("response: ", response);

  return response;
};


// const response = {
//   statusCode: 200,
//   headers: {
//     'Access-Control-Allow-Headers': 'Content-Type',
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
//   },
//   body: JSON.stringify(Items),
// };