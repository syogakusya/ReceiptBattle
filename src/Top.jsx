import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import { useFetchCurrentUser } from './Home';
// import { collection, getDocs } from 'firebase/firestore';
// import { doc, setDoc } from 'firebase/firestore';

import './App.css';

function Top() {
  const [uid, setUid] = useState(null);
  const [userName, setUserName] = useState('');
  const [weaponUrl, setWeaponUrl] = useState('');
  const [point, setPoint] = useState('0');
  const [characterUrl, setCharacterURL] = useState('');
  const currentUserInfo = useFetchCurrentUser();

  useEffect(() => {
    if (auth.currentUser && currentUserInfo) {
      setUid(auth.currentUser.uid);
      setUserName(currentUserInfo.userName);
      setPoint(currentUserInfo.point);
      console.log(auth.currentUser.uid);

      const storage = getStorage();
      const weaponName = `weapon${currentUserInfo.weaponID}.png`;
      const weaponRef = ref(storage, `weapon/${weaponName}`);
      const characterName = `character${currentUserInfo.characterID}.png`;
      const characterRef = ref(storage, `character/${characterName}`);

      getDownloadURL(weaponRef)
        .then((url) => {
          setWeaponUrl(url);
        })
        .catch((error) => {
          console.error('武器画像の取得に失敗しました:', error);
        });
      getDownloadURL(characterRef)
        .then((url) => {
          setCharacterURL(url);
          console.log(characterUrl);
        })
        .catch((error) => {
          console.error('キャラクター画像の取得に失敗しました:', error);
        });
    }
  }, [currentUserInfo]);

  function SignOutButton() {
    return (
      <button
        className="shadow-none my-5"
        type="button"
        onClick={() => auth.signOut()}
      >
        <img src="../src/images/SignOut.png" className="text-black w-8 h-8" />
      </button>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex-col items-center justify-center min-h-screen bg-[#f4f4f4]">
        <div className="flex items-center justify-center space-x-[1250px]">
          <SignOutButton />
          <div className="flex space-x-10">
            <span className="font-semibold flex">{userName}</span>
            <div className="flex space-x-1">
              <img
                src="../src/images/PointIcon.png"
                className="text-black w-8 h-8 flex"
              />
              <div className="mr-10">{point}p</div>
            </div>
          </div>
        </div>

        {/* Charactor */}
        <div className="flex my-8 mx-[620px] items-end">
          <img
            alt="Character"
            className="flex w-[160px] h-[379px]"
            src={characterUrl}
          />
          <div className="block">
            <img
              alt="Weapon"
              className="w-[70px] h-[70px] items-center"
              src={weaponUrl}
            />
            <div className="sw-10 h-5 bg-gray-600 rounded-[60%]"></div>
          </div>
        </div>

        {/* Items */}
        <div className="flex items-center justify-center space-x-16">
          <div className="p-4 w-15 h-15 bg-white rounded-full">
            <img
              className="w-10 h-10"
              src="../src/images/Setting.png"
              alt="Setting"
            />
          </div>
          <div className="p-4 w-15 h-15 bg-white rounded-full">
            <img
              className="w-10 h-10"
              src="../src/images/Reciept.png"
              alt="Receipt"
            />
          </div>
          <div className="p-4 w-15 h-15 bg-white rounded-full">
            <Link to={'/battle'}>
              <img
                className="w-10 h-10"
                src="../src/images/Sword.png"
                alt="battle"
              />
            </Link>
          </div>
          <div className="p-4 w-15 h-15 bg-white rounded-full">
            <Link to={'/eqiupment'}>
              <img
                className="w-10 h-10"
                src="../src/images/Armor.png"
                alt="itemlist"
              />
            </Link>
          </div>
          <div className="p-4 w-15 h-15 bg-white rounded-full">
            <img
              className="w-10 h-10"
              src="../src/images/Point.png"
              alt="kakeibo"
            />
          </div>
          <div className="p-4 w-15 h-15 bg-white rounded-full">
            <Link to={'/GatyaGatya'}>
              <img
                className="w-[40px] h-[30px] my-[5px]"
                src="../src/images/Item.png"
                alt="gatya"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Top;
