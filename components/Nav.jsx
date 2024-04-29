"use client"

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import WaitlistModal from "./WaitlistModal";
import { GiTennisCourt } from "react-icons/gi";


const Nav = () => {
    const { data: session } = useSession()

    const [providers, setProviders] = useState(null)
    const [toggleDropdown, setToggleDropdown] = useState(false);
    const [toggleWaitlistPopup, setToggleWaitlistPopup] = useState(false)

    useEffect(() => {
        (async () => {
            const res = await getProviders();
            setProviders(res);
        })();
    }, []);


  return (
    <nav className='w-full mb-16 py-3 px-6 flex items-center justify-between'>
      <Link href='/'>
        <div className="text-white text-2xl font-bold flex items-center">
          <GiTennisCourt className="mr-1"/>
          RallyHub
        </div>
      </Link>
      <WaitlistModal isOpen={toggleWaitlistPopup} onClose={() => setToggleWaitlistPopup(false)} />
      <div className="flex flex-row">
        <button className="rounded-full bg-yellow-300 py-2 px-3 hover:bg-yellow-400 mr-5" onClick={() => setToggleWaitlistPopup(true)}>
            Join Our Waitlist!
        </button>
        {/* Desktop Navigation */}
        <div className='sm:flex hidden'>
          {session?.user ? (
            <div className='flex gap-3 md:gap-5 items-center'>
              <button type='button' onClick={signOut} className='underline-button'>
                Sign Out
              </button>

              <Link href='/profile'>
                <Image
                  src={session?.user.image}
                  width={37}
                  height={37}
                  className='rounded-full'
                  alt='profile'
                />
              </Link>
            </div>
          ) : (
            <>
              {providers &&
                Object.values(providers).map((provider) => (
                  <button
                    type='button'
                    key={provider.name}
                    onClick={() => {
                      signIn(provider.id);
                    }}
                    className='underline-button'
                  >
                    Sign in
                  </button>
                ))}
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className='sm:hidden flex relative'>
        {session?.user ? (
          <div className='flex'>
            <Image
              src={session?.user.image}
              width={37}
              height={37}
              className='rounded-full'
              alt='profile'
              onClick={() => setToggleDropdown(!toggleDropdown)}
            />

            {toggleDropdown && (
              <div className='absolute top-12 right-0 w-28 flex flex-col justify-center items-center rounded-lg shadow-xl bg-white h-24'>
                <Link
                  href='/profile'
                  className='p-2 border-b border-gray-400'
                  onClick={() => setToggleDropdown(false)}
                >
                  My Profile
                </Link>
                <button
                  type='button'
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                  className='p-2'
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type='button'
                  key={provider.name}
                  onClick={() => {
                    signIn(provider.id);
                  }}
                  className='underline-button'
                >
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  )
}

export default Nav