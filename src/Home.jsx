import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import './index.css';

function Home() {
  const [user] = useAuthState(auth);
  return (
    <div>
      {user ? (
        <>
          <UserInfo />
          <Start />
          <SignOutButton />
          <PhotoMode />
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
    <div className="flex justify-center items-center h-screen bg-[#f4f4f4]">
      <div className="bg-[#fffacd] p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">Receipt Battle</h1>
        <p className="text-sm mb-4">
          <span className="block">MM/DD/YYYY</span>
          <span className="block">Address line</span>
          <span className="block">Manager: You</span>
        </p>
        <div className="border-t border-dashed border-black pt-4 mb-4">
          <p className="text-sm">
            <span className="block">Terms of service</span>
            <span className="block">Privacy policy</span>
          </p>
          <p className="text-right text-sm">$0</p>
        </div>
        <div className="border-t border-dashed border-black pt-4 mb-8">
          <p className="text-sm mb-4">login with Google ↓</p>
          <p className="text-right text-sm">$0</p>
        </div>
        <button
          onClick={signInWithGoogle}
          className="bg-[#adff2f] w-full py-4 rounded text-xl text-black font-bold"
        >
          Login
        </button>
      </div>
    </div>
  );
}

function SignOutButton() {
  return (
    <button onClick={() => auth.signOut()}>
      <img src='../src/images/SignOut.png' className="text-black w-8 h-8 my-2" />
    </button>
  );
}

function UserInfo() {
  return (
    <div className="userInfo">
      <img className="profile_img" src={auth.currentUser.photoURL} alt="" />
      <p>{auth.currentUser.displayName}</p>
    </div>
  );
}

function Start() {
  const userInfo = useFetchCurrentUser(); // ユーザー情報をフックから取得
  const [userName, setUserName] = useState('');
  const [gender, setGender] = useState('male');
  const firstWeapon = 1;
  const firstPoint = 0;
  const hitPoint = 100;

  // 新規ユーザー登録の処理
  const handleRegister = async () => {
    if (!userName) {
      alert('ユーザー名を入力してください。');
      return;
    }
    try {
      var firstCharacter;
      if (gender === 'male') {
        firstCharacter = 1;
      } else {
        firstCharacter = 2;
      }
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        userID: auth.currentUser.uid,
        userName: userName,
        gender: gender,
        CharacterID: firstCharacter,
        weaponID: firstWeapon,
        point: firstPoint,
        hitpoint: hitPoint,
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
          <p>ユーザー名と性別を入力してください:</p>
          <input
            type="text"
            placeholder="ユーザー名"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <div>
            <label>
              Male
              <input
                type="radio"
                value="male"
                checked={gender === 'male'}
                onChange={(e) => setGender(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Female
              <input
                type="radio"
                value="female"
                checked={gender === 'female'}
                onChange={(e) => setGender(e.target.value)}
              />
            </label>
          </div>
          <button onClick={handleRegister}>登録</button>
        </div>
      )}
    </div>
  );
}

function PhotoMode() {
  return (
    <button>
      <Link to={`/takephoto`}>
        <p>撮影モード</p>
      </Link>
    </button>
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
