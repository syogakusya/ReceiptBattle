import{useRef, useState, useCallback} from 'react';
import Webcam from 'react-webcam';
import './TakePhoto.css'
import { ref, uploadBytesResumable, getDownloadURL, storage } from "./firebase.jsx";
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

  //引数はbase64形式の文字列と作成するファイルオブジェクトのファイル名
var createJpegFile4Base64 = function (base64, name) {
  // base64のデコード
  var bin = atob(base64.replace(/^.*,/, ''));
  // バイナリデータ化
  var buffer = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) {
      buffer[i] = bin.charCodeAt(i);
  }
  // ファイルオブジェクト生成(この例ではjpegファイル)
  return new File([buffer.buffer], name, {type: "image/jpeg"});
};

const convertToJpeg = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name.replace(/\.[^/.]+$/, ".jpeg"), {
              type: "image/jpeg",
            }));
          } else {
            reject(new Error("Canvas toBlob failed"));
          }
        }, "image/jpeg");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const uploadFile = async (file) => {
  try {
    const jpegFile = await convertToJpeg(file);
    const storageRef = ref(storage, `receipts/${jpegFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, jpegFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
        });
      }
    );
  } catch (error) {
    console.error("File conversion failed:", error);
  }
};


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
            <img src={url } alt="Screenshot" />
          </div>
          <div>
            <button onClick= {
              () => {
                uploadFile(createJpegFile4Base64(url, (Math.round(Math.random() * 100000)).toString()));
              }
            }></button>
          </div>
        </>
      )}
    </>
  );
}

export default TakePhoto;
