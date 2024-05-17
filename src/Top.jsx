import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { Link } from 'react-router-dom';
import { useFetchCurrentUser } from './Home'; // ここでカスタムフックをインポートします。パスは適切に修正してください。

function Top() {
  const [uid, setUid] = useState(null);
  const currentUserInfo = useFetchCurrentUser(); // userInfo が変数名として既に存在しているため、ここでは currentUserInfo という名前を使います
  console.log(currentUserInfo);

  useEffect(() => {
    if (auth.currentUser) {
      setUid(auth.currentUser.uid);
      console.log(auth.currentUser.uid);
    }
  }, []);

  return (
    <>
      <div>トップメニュー</div>
      {uid && currentUserInfo && (
        <>
          <div>ユーザーID: {currentUserInfo.userID}</div>
          <div>ユーザー名: {currentUserInfo.userName}</div>
        </>
      )}
      <button>
        <Link to={`/users`}>
          <p>ユーザー一覧</p>
        </Link>
      </button>
    </>
  );
}

export default Top;
