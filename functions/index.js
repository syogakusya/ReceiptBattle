import functions from "firebase-functions";
import vision from "@google-cloud/vision";
import admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

const validateParamsSchema = (params) => {
  const hasImg = "img" in params;
  return hasImg;
};

const imgToText = async (img) => {
  const client = new vision.ImageAnnotatorClient();
  const request = {
    "requests": [
      {
        "image": {
          "content": img,
        },
        "features": [
          {
            "type": "TEXT_DETECTION",
          },
        ],
        "imageContext": {
          "languageHints": ["ja"],
        },
      },
    ],
  };
  const [result] = await client.textDetection(request);
  const detections = result.fullTextAnnotation;
  if (detections !== null && detections !== undefined) {
    console.log(detections.text);
    return detections.text;
  }
};

export const scanReceipt = functions.https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, HEAD");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  const params = req.body;

  if (!validateParamsSchema(params)) {
    res.status(400).send({errorMessage: "パラメータが不正です"});
    if (params.img == "aaaa" ) {
      console.log("aaaaa");
    }
  } else {
    res.status(200).send(imgToText(params.img));
  }
});
