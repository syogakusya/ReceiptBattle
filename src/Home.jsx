import { signInWithPopup } from 'firebase/auth';
import React from 'react';
import { auth, provider } from './firebase';

function Home() {
  return (
    <div>
      <SignInButton />
    </div>
  );
}

export default Home;

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
