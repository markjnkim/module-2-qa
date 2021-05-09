import React, { useState, useRef } from "react";
// import { formatUrl } from "@aws-sdk/util-format-url";

const ThoughtForm = () => {
  const [formState, setFormState] = useState({
    username: "",
    thought: "",
    image: "",
  });
  const [characterCount, setCharacterCount] = useState(0);
  const fileInput = useRef(null);

  const getUploadUrl = async () => {
    const res = await fetch(
      "https://5panwslpf6.execute-api.us-east-2.amazonaws.com/Prod/api/pre-url"
    );

    return await res.json();
  };

  const handleImageUpload = async (event) => {
    event.preventDefault();
    // retrieve the URL and file name
    try {
      var s3res = await getUploadUrl();
    } catch (err) {
      console.error(err);
    }

    // if (!s3res.ok) throw new Error(s3res);

    const { uploadURL, Key, bucket, region } = s3res;
    console.log("uploadURL: ", uploadURL, "Key: ", Key);
    console.log("bucket: ", bucket, "region: ", region);
    const data = new FormData();
    data.append('image', fileInput.current.files[0]);

    console.log("data: ", data);
    console.log("fileInput: ", fileInput.current.files[0]);
    // create a binary file from the file
    let blobData = new Blob([new Uint8Array(fileInput.current.files)], { type: 'image/jpeg'});

    try {
      var result = await fetch(uploadURL, {
        method: 'PUT',
        body: blobData,
      })
    } catch(err) {
      console.error(err);
    }


    // const { uploadUrl, Key } = await getUploadUrl();
    // console.info(uploadUrl, Key);
    // console.log(JSON.stringify(uploadUrl), JSON.stringify(Key));
    // const data = new FormData();
    // data.append('image', fileInput.current.files[0]);
    // alert(JSON.stringify(data));
    // // post image to S3 bucket
    // const postImage = async () => {

    //     const uploadS3URL = getUploadUrl();
    //     console.log(uploadS3URL);

    // const res = await fetch(uploadS3URL, {
    //   method: 'PUT',
    //   body: data
    // })
    // if (!res.ok) throw new Error(res.statusText);
    // const postResponse = await res.json();
    // setFormState({...formState, image: postResponse.Location})
    // console.log("formState", formState);
    // console.log("uploadURL", JSON.stringify(uploadS3URL));

    // return postResponse.Location;

    // };
    // postImage();
  };

  // update state based on form input changes
  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setFormState({ ...formState, [event.target.name]: event.target.value });
      setCharacterCount(event.target.value.length);
    }
  };

  // submit form
  const handleFormSubmit = (event) => {
    event.preventDefault();

    const postData = async () => {
      const res = await fetch(
        "https://5panwslpf6.execute-api.us-east-2.amazonaws.com/Prod/api/users",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        }
      );
      const data = await res.json();
      console.log(data);
    };

    postData();

    // clear form value
    setFormState({ username: "", thought: "", image: "" });
    setCharacterCount(0);
  };

  return (
    <div>
      <p className={`m-0 ${characterCount === 280 ? "text-error" : ""}`}>
        Character Count: {characterCount}/280
      </p>
      <form
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <input
          placeholder="Name"
          name="username"
          value={formState.username}
          className="form-input col-12 "
          onChange={handleChange}
        ></input>
        <textarea
          placeholder="Here's a new thought..."
          name="thought"
          value={formState.thought}
          className="form-input col-12 "
          onChange={handleChange}
        ></textarea>
        <label className="form-input col-12  p-1">
          Add an image to your thought:
          <input type="file" ref={fileInput} className="form-input p-2 " />
          <button className="btn " onClick={handleImageUpload} type="submit">
            Upload
          </button>
        </label>

        <button className="btn col-12 " type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;
