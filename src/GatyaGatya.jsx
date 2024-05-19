import { useState } from 'react';
import './index.css';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export function getRandomNumber() {
  return Math.floor(Math.random() * 10) + 1;
}

function GatyaGatya() {
  const [isDropped, setIsDropped] = useState(false);
  const [weaponUrl, setWeaponUrl] = useState('');
  const [weaponID, setWeaponID] = useState(0);

  const weaponNames = [
    'Sword',
    'Knife',
    'Double Axe',
    'Shuriken',
    'Spear',
    'Pistol',
    'Nunchaku',
    'Dual Swords',
    'Rifle',
    'Chainsaw',
  ];

  const handleDrop = () => {
    setIsDropped(true);
    const newWeaponID = getRandomNumber();
    setWeaponID(newWeaponID);
    const storage = getStorage();
    const weaponRef = ref(storage, `weapon/weapon${newWeaponID}.png`);
    getDownloadURL(weaponRef)
      .then((url) => {
        setWeaponUrl(url);
      })
      .catch((error) => {
        console.error('武器画像の取得に失敗しました:', error);
      });
    console.log(newWeaponID);
  };

  const handleReload = () => {
    window.location.reload();
    const newWeaponID = getRandomNumber();
    setWeaponID(newWeaponID);
    const storage = getStorage();
    const weaponRef = ref(storage, `weapon/weapon${newWeaponID}.png`);
    getDownloadURL(weaponRef)
      .then((url) => {
        setWeaponUrl(url);
      })
      .catch((error) => {
        console.error('武器画像の取得に失敗しました:', error);
      });
    console.log(newWeaponID);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen bg-[#f4f4f4]">
        <div className="relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-10 z-40 h-5 w-[560px] bg-[#9c9c9c] rounded flex items-center justify-center"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-10 z-20 h-10 w-[560px] bg-[#9c9c9c] rounded flex items-center justify-center"></div>
          <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 mb-20 z-40 h-20 w-[560px] bg-[#f4f4f4] rounded flex items-center justify-center"></div>
        </div>
        <div
          className={`relative transform transition-transform duration-700 z-30 ${
            isDropped ? 'translate-y-[60px]' : '-translate-y-[600px] z-30'
          }`}
        >
          <div className="bg-[#fff4d9] relative p-16 shadow-lg z-30">
            <h1 className="text-6xl font-bold mb-8 mt-10 text-center">
              ReceiptBattle
            </h1>
            <p className="text-lg mb-8 text-center">
              <img src={weaponUrl} className="gatya-weapon" />
              <p className="mt-4">{weaponNames[weaponID - 1]}</p>
            </p>
            <div className="border-t border-dashed border-black pt-8 mb-8">
              <p className="text-lg">
                <span className="flex justify-between">
                  <span className="block">Attack</span>
                  <span>$20</span>
                </span>
                <span className="flex justify-between">
                  <span className="block">Speed</span>
                  <span>$10</span>
                </span>
              </p>
            </div>
            <div className="text-right text-lg flex justify-between border-t border-dashed border-black pt-8 mb-16">
              <span className="text-lg mb-8">Rank</span>
              <span className="text-lg">$$R</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleDrop}
          className={`animate-bounce rounded mb-40 py-3 px-10 text-4xl text-black font-bold bg-[#95ff8c] shadow-none transition-opacity duration-700 ${
            isDropped ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          Check out (30p)
        </button>
        <button
          onClick={handleReload}
          className={`mb-10 py-2 px-4 text-2xl text-black font-bold bg-transparent border-none shadow-none transition-opacity duration-700 ${
            isDropped ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          One more(30p)
        </button>
      </div>
    </>
  );
}

export default GatyaGatya;
