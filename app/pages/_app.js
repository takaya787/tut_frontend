import '../styles/globals.css'
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, createContext } from 'react';
//Module
import { Auth } from '../modules/Auth'

export const UserContext = createContext();
const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}auto_login`

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState({ email: '', id: 0, gravator_url: '', name: '' })
  const UserValue = {
    user,
    setUser,
  };

  //tokenがあれば自動login
  useEffect(function () {
    const token = Auth.getToken();
    if (token === 'undefined' || token === null) {
      Auth.logout();
      return
    }
    if (user.id === 0 && token) {
      fetch(baseUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log('dataを表示')
          console.log(data) // {id: 1, email: "test@example.com"}
          if (data.error) {
            alert('ページをreloadしてください');
            return
          }
          const user_data = data.user
          setUser({ email: user_data.email, id: user_data.id, name: user_data.name, gravator_url: user_data.gravator_url });
        })
    }
  }, []) // [] => changed to => [user]

  return (
    <UserContext.Provider value={UserValue}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

export default MyApp
