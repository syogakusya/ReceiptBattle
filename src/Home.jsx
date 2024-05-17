import { signInWithPopup } from 'firebase/auth';
import React from 'react';
import { auth, provider } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './firebase';

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
      <p>グーグルでサインイン</p>
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
      <img src={auth.currentUser.photoURL} alt="" />
      <p>{auth.currentUser.displayName}</p>
    </div>
  );
}

function Start() {
  const userInfo = useFetchCurrentUser(); // ユーザー情報をフックから取得

  return (
    <div>
      {userInfo ? (
        // ユーザーが見つかった場合の表示
        <button>
          <Link to={`/top`}>
            <p>スタート</p>
          </Link>
        </button>
      ) : (
        // ユーザー情報がない場合の表示
        <div>
          <p>ユーザー情報を取得中...</p>
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
