import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Link } from 'react-router-dom';
import { useFetchCurrentUser } from './Home'; 
import './App.css';

function Top() {
  const [uid, setUid] = useState(null);
  const [weaponUrl, setWeaponUrl] = useState('');
  const currentUserInfo = useFetchCurrentUser(); 

  useEffect(() => {
    if (auth.currentUser && currentUserInfo && currentUserInfo.weaponID) {
      setUid(auth.currentUser.uid);
      console.log(auth.currentUser.uid);

      const storage = getStorage();
      const weaponName = `weapon${currentUserInfo.weaponID}.png`;
      const weaponRef = ref(storage, `weapon/${weaponName}`); 

      getDownloadURL(weaponRef)
        .then((url) => {
          setWeaponUrl(url); 
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
      {weaponUrl && <img className="weapon_img" src={weaponUrl} alt={`Weapon ${currentUserInfo?.weaponID}`} />} 
      <button>
        <Link to={`/users`}>
          <p>ユーザー一覧</p>
        </Link>
      </button>
    </>
  );
}

export default Top;
