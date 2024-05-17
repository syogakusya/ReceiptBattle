import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const usersData = collection(db, 'users');
        const snapShot = await getDocs(usersData);
        console.log(snapShot.docs.map((doc) => ({ ...doc.data() })));
        setUsers(snapShot.docs.map((doc) => ({ ...doc.data() })));
      } catch (error) {
        console.error('Error fetching user ranking data: ', error);
      }
    };

    fetchUsersData();
  }, []);

  return (
    <div>
      {users.map((user) => (
        <div key={user.userID}>
          <p>ユーザーID: {user.userID}</p>
          <p>ユーザー名: {user.userName}</p>
          <p>武器ID: {user.weaponID}</p>
          <p>防具ID: {user.armorID}</p>
          <p>ポイント: {user.point}</p>
        </div>
      ))}
    </div>
  );
}

export default Users;
