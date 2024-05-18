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
    <>
      <div className="flex flex-col justify-center items-center h-screen bg-[#f4f4f4]">
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-10 w-[560px] bg-[#9c9c9c] rounded "></div>
        </div>
        <div className="bg-[#fff4d9] p-16  shadow-lg z-20">
          <h1 className="text-6xl font-bold mb-8 mt-10">Receipt Battle</h1>
          <p className="text-lg mb-8 text-center">
            <span className="block">MM/DD/YYYY</span>
            <span className="block">Address line</span>
            <span className="block">Manager: You</span>
          </p>
          <div className="border-t border-dashed border-black pt-8 mb-8">
            <p className="text-lg">
              <span className="flex justify-between">
                <span className="block">Terms of service</span>
                <span>$0</span>
              </span>
              <span className="flex justify-between">
                <span className="block">Privacy policy</span>
                <span>$0</span>
              </span>
            </p>
          </div>
          <div className="text-right text-lg flex justify-between border-t border-dashed border-black pt-8 mb-16">
            <span className="text-lg mb-8">login with Google ↓</span>
            <span className="text-lg">$0</span>
          </div>
          <button
            onClick={signInWithGoogle}
            className="bg-[#95ff8c] w-full py-8 rounded text-5xl text-black font-bold"
          >
            Login
          </button>
        </div>
      </div>
    </>
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
