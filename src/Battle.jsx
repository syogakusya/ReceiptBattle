import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useFetchCurrentUser } from './Home'; 
import './App.css';

function Battle() {
  const [uid, setUid] = useState(null);
  const [weaponUrl, setWeaponUrl] = useState('');
  const [characterUrl, setCharacterUrl] = useState('');
  const [monsterUrl, setMonsterUrl] = useState('');
  const currentUserInfo = useFetchCurrentUser();
  const [monsterHP, setMonsterHP] = useState(100);
  const [characterHit, setCharacterHit] = useState(false);
  const [userHP, setUserHP] = useState(null);
  const [start, setStart] = useState(false);
  const [attackCount, setAttackCount] = useState(0);
  const [gameStatus, setGameStatus] = useState('');
  const monsterID = 1;
  const monsterName = "グリムリン";

  useEffect(() => {
    if (auth.currentUser && currentUserInfo && currentUserInfo.hitPoint) {
      setUid(auth.currentUser.uid);
      setUserHP(currentUserInfo.hitPoint);

      const storage = getStorage();
      const weaponName = `weapon${currentUserInfo.weaponID}.png`;
      const weaponRef = ref(storage, `weapon/${weaponName}`);
      const characterName = `character${currentUserInfo.characterID}.png`;
      const characterRef = ref(storage, `character/${characterName}`);
      const monsterImageName = `monster${monsterID}.png`;
      const monsterRef = ref(storage, `monster/${monsterImageName}`);

      getDownloadURL(weaponRef).then(setWeaponUrl).catch(console.error);
      getDownloadURL(characterRef).then(setCharacterUrl).catch(console.error);
      getDownloadURL(monsterRef).then(setMonsterUrl).catch(console.error);
    }
  }, [currentUserInfo]);

  useEffect(() => {
    if (monsterHP <= 0) {
      setGameStatus('勝ち');
      setStart(false);
    }else if (userHP <= 0) {
      setGameStatus("負け");
      setStart(false);
    }
  }, [monsterHP, userHP]);

  const attackMonster = () => {
    if (start && monsterHP > 0) {
      const newHP = monsterHP - 25;
      setMonsterHP(newHP > 0 ? newHP : 0);
      setAttackCount(attackCount + 1);

      // 3回ごとにモンスターから反撃
      if ((attackCount + 1) % 3 === 0) {
        attackUser();
      }
    }
  };

  const attackUser = () => {
    if (start && userHP > 0) {
      const newUserHP = userHP - 25;
      setUserHP(newUserHP > 0 ? newUserHP : 0);
      setCharacterHit(true); //攻撃を受けたフラグ

      setTimeout(() => {
        setCharacterHit(false);
      }, 300);
    }
  };

  return (
    <>
      <div>
        {!start ? <h1>準備はいいですか？</h1> : <h1>スタート！</h1>}
        {gameStatus && userHP <= 0 || monsterHP <= 0 &&<h1>結果: {gameStatus}</h1>}
        {uid && (
          <>
            <div>ユーザー名: {currentUserInfo?.userName}</div>
            <div>HP: {userHP}</div>
          </>
        )}
        <div className='monsterInfo'>
          <div>モンスター名: {monsterName}</div>
          <div>HP: {monsterHP}</div>
        </div>
        <div className='parent'>
        <div className='userStatus'>
          <img className={`character_img ${characterHit ? 'hit' : ''}`} src={characterUrl} alt={`Character ${currentUserInfo?.characterID}`} />
          <img className="weapon_img" src={weaponUrl} alt={`Weapon ${currentUserInfo?.weaponID}`} />
        </div>
          <div className='monsterStatus' onClick={attackMonster}>
            <img className="monster_img" src={monsterUrl} alt={`Monster ${monsterID}`} />
          </div>
        </div>
        <div className="center-button">
          {!start && <button onClick={() => setStart(true)}>戦闘開始</button>}
        </div>
      </div>
    </>
  );
}

export default Battle;
