
'use client'
import { useRouter } from 'next/navigation';
import { auth, provider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import state from './store';

export default function Home() {

  const router = useRouter();

  const handleSignIn = async()=>{
    let res =  await signInWithPopup(auth , provider);
      let userName = res.user.displayName;
    
      // store data in global store
      state.user = userName;

    router.push('/todo');
  }

  return (
    <div className=' w-[100vw] h-[100vh] flex justify-center  back'>
          <div className=' mt-36'>
          <h1 className=' text-xl'>To start you have to sign in with Google</h1>
          <button className='mt-4 ml-28 px-7 py-2 text-white rounded bg-slate-700' onClick={handleSignIn}>Sign-In</button>
          </div>
    </div>
  )
}
