import{useRef, useState, useCallback} from 'react';
import Webcam from 'react-webcam';
import './TakePhoto.css'
import './ScanReceipt';
import { storage, ref, uploadString, getDownloadURL } from './firebase';

const uploadImageToFirebase = async (base64Image) => {
  const storageRef = ref(storage, 'images/receipt.jpg');
  await uploadString(storageRef, base64Image, 'data_url');
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

const getBase64ImageFromUrl = async (imageUrl) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export { uploadImageToFirebase, getBase64ImageFromUrl };
//use at mobile on deploy

// const videoConstraints = {
//   width: 720,
//   height: 360,
//   faceMode:{exact:"environment"},
// }

function TakePhoto(){
  const [isCaptureEnable, setCaptureEnable] = useState(false);
  const webcamRef = useRef(null);
  const [url, setUrl] = useState(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
    }
  }, [webcamRef]);

  return (
    <>
      <header>
        <h1>カメラアプリ</h1>
      </header>
      {isCaptureEnable || (
        <button onClick={() => setCaptureEnable(true)}>開始</button>
      )}
      {isCaptureEnable && (
        <>
          <div>
            <button onClick={() => setCaptureEnable(false)}>終了</button>
          </div>
          <div>
            <Webcam
              audio={false}
              width={540}
              height={360}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              //videoConstraints={videoConstraints}
            />
          </div>
          <button onClick={capture}>キャプチャ</button>
        </>
      )}
      {url && (
        <>
          <div>
            <button
              onClick={() => {
                setUrl(null);
              }}
            >
              削除
            </button>
          </div>
          <div>
            <img src={url} alt="Screenshot" />
          </div>
        </>
      )}
    </>
  );
}

export default TakePhoto;
