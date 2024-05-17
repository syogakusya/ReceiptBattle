import { signInWithPopup } from 'firebase/auth';
import React from 'react';
import { auth, provider } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

function Home() {
  const [user] = useAuthState(auth);
  return (
    <div>
      {user ? (
        <>
          <UserInfo />
          <Start />
          <SignOutButton />
        </>
      ) : (
        <SignInButton />
      )}
    </div>
  );
}

export default Home; // Homeをデフォルトエクスポート

function SignInButton() {
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider);
  };

  return (
    <button onClick={signInWithGoogle}>
      <p>Googleでサインイン</p>
    </button>
  );
}

function SignOutButton() {
  return (
    <button onClick={() => auth.signOut()}>
      <p>サインアウト</p>
    </button>
  );
}

function UserInfo() {
  return (
    <div className="userInfo">
      <img className='profile_img' src={auth.currentUser.photoURL} alt="" />
      <p>{auth.currentUser.displayName}</p>
    </div>
  );
}

function Start() {
  const userInfo = useFetchCurrentUser(); // ユーザー情報をフックから取得
  const [userName, setUserName] = useState('');
  const firstWeapon = 1;
  const firsttArmor = 1;
  const firstPoint = 0;

  // 新規ユーザー登録の処理
  const handleRegister = async () => {
    if (!userName) {
      alert('ユーザー名を入力してください。');
      return;
    }
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        userID: auth.currentUser.uid,
        userName: userName,
        weaponID: firstWeapon,
        armorID: firsttArmor,
        point: firstPoint,
      });
      console.log('ユーザー情報を登録しました。');
      window.location.reload(); // 登録成功後にページをリロード
    } catch (error) {
      console.error('ユーザー情報の登録に失敗しました: ', error);
    }
  };

  return (
    <div>
      {userInfo ? (
        <button>
          <Link to={`/top`}>
            <p>スタート</p>
          </Link>
        </button>
      ) : (
        <div>
          <p>ユーザー名と武器IDを入力してください:</p>
          <input
            type="text"
            placeholder="ユーザー名"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={handleRegister}>登録</button>
        </div>
      )}
    </div>
  );
}

export function useFetchCurrentUser() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const usersData = collection(db, 'users');
        const snapShot = await getDocs(usersData);
        const usersFetched = snapShot.docs.map((doc) => ({ ...doc.data() }));
        const currentUserId = auth.currentUser.uid;
        const foundIndex = usersFetched.findIndex(
          (p) => p.userID === currentUserId
        );

        if (foundIndex !== -1) {
          setUserInfo(usersFetched[foundIndex]);
        } else {
          console.log('登録されていません');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUsersData();
  }, []);

  return userInfo;
}
