import * as React from "react"
import * as tf from '@tensorflow/tfjs';
import {useEffect, useRef, useState} from "react";
import {getCategory} from "./utils";
import  "../styles/styles.css";

const model = await tf.loadLayersModel('http://127.0.0.1:8080/model.json');

const IndexPage = () => {
  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);
  const [category, setCategory] = useState(null);
  const uploadedImage = useRef(null)

useEffect(() => {
  let fileReader, isCancel = false;
  if (file) {
    fileReader = new FileReader();
    fileReader.onload = (e) => {
      const { result } = e.target;
      if (result && !isCancel) {
        setFileDataURL(result)
      }
    }
    fileReader.readAsDataURL(file);
  }
  return () => {
    isCancel = true;
    if (fileReader && fileReader.readyState === 1) {
      fileReader.abort();
    }
  }
}, [file]);

  const handleFileInput = (e) => {
    const img = e.target.files[0];
    setFile(img);

    const interval = setTimeout(() => {
      predict(uploadedImage.current)
    }, 50);
    return () => clearInterval(interval);
  }

  const predict = (imgFile) => {
    if (!imgFile)  return;
    const img = tf.cast(tf.browser.fromPixels(imgFile), 'float32').resizeBilinear([150,150])

    const offset = tf.scalar(127.5);
    const normalized = img.sub(offset).div(offset);
    const batched = normalized.reshape([1, 150, 150, 3]);

    const results = model.predict(batched);
    console.log(results.max().dataSync()[0])
    setCategory(getCategory(results.dataSync().indexOf(results.max().dataSync()[0])))
  }

  return (
    <main className="wrapper">
      <div className="container">
        <div className="column">
          <h1>
            LANDSCAPE RECOGNITION
          </h1>
      <div className="input_container">
        <input type="file" accept="image/*" onChange={handleFileInput} width={150} height={150}/>
      </div>
      </div>
      <div className="column">
        {fileDataURL ?
        <p>
          {
            <img src={fileDataURL} alt="preview" ref={uploadedImage} height={300} width={300} />
          }
        </p> : null}
        {category ?
        <p className="result">
          {
            category
          }
        </p> : null}
      </div>
      </div>
    </main>
  )
}

export default IndexPage