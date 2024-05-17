import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { Link } from 'react-router-dom';

function Top() {
  const [uid, setUid] = useState(null);
  useEffect(() => {
    if (auth.currentUser) {
      setUid(auth.currentUser.uid);
      console.log(auth.currentUser.uid);
    }
  }, []);

  return (
    <>
      <div>トップメニュー</div>
      {uid && <div>ユーザーID: {uid}</div>}
      <button>
        <Link to={`/users`}>
          <p>ユーザー一覧</p>
        </Link>
      </button>
    </>
  );
}

export default Top;
