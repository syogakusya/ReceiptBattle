import axios from 'axios';

function sendImg(img){
  const url = import.meta.env.VITE_SCAN_API_KEY_LOCAL;
  const a = "aaaa";
  console.log(url +"'"+`img=${a}` + "'");
  axios.post(url +"'" + `img=${a}`+ "'")
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('リクエストエラー', error);
  });
}

function ScanReceipt({ img }) {
  return (
    <>
      <button onClick={() => sendImg(img)}>
        <p>スキャン</p>
      </button>
    </>
  )
}

export default ScanReceipt;
