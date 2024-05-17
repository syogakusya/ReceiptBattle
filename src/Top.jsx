import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Link } from 'react-router-dom';
import { useFetchCurrentUser } from './Home'; 
import './App.css';

function Top() {
  const [uid, setUid] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); 
  const currentUserInfo = useFetchCurrentUser(); 

  useEffect(() => {
    if (auth.currentUser && currentUserInfo && currentUserInfo.weaponID) {
      setUid(auth.currentUser.uid);
      console.log(auth.currentUser.uid);

      const storage = getStorage();
      const imageName = `weapon${currentUserInfo.weaponID}.png`;
      const imageRef = ref(storage, `weapon/${imageName}`); 

      getDownloadURL(imageRef)
        .then((url) => {
          setImageUrl(url); 
        })
        .catch((error) => {
          console.error("画像の取得に失敗しました:", error);
        });
    }
  }, [currentUserInfo]); 

  return (
    <>
      <div>トップメニュー</div>
      {uid && currentUserInfo && (
        <>
          <div>ユーザーID: {currentUserInfo.userID}</div>
          <div>ユーザー名: {currentUserInfo.userName}</div>
        </>
      )}
      {imageUrl && <img className="weapon_img" src={imageUrl} alt={`Weapon ${currentUserInfo?.weaponID}`} />} 
      <button>
        <Link to={`/users`}>
          <p>ユーザー一覧</p>
        </Link>
      </button>
    </>
  );
}

export default Top;
