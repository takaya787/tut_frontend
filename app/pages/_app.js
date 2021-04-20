import '../styles/globals.css'
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, createContext } from 'react';
//Module
import { Auth } from '../modules/Auth'

export const UserContext = createContext();
const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}auto_login`

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState({ email: '', id: 0, name: '' })
  const UserValue = {
    user,
    setUser,
  };
  return (
    <UserContext.Provider value={UserValue}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

export default MyApp
