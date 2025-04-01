"use client"
import { signWithGoogle } from '@/utils/supabase/authentications'
import React from 'react'

const LoginPage =() => {
  return (
    <div>
        LoginPage
        <button onClick={() => signWithGoogle()}>Sign In with Google </button>
    </div>
  )
}

export default LoginPage