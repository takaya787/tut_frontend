import React, { useState, useEffect, useReducer, createContext } from 'react';
//Module
import { Auth } from '../modules/Auth'
//reducers
import { FlashReducer } from '../reducers/FlashReducer'
//types
import { FlashStateType, FlashActionType } from '../types/FlashType'
import { UserContextType } from '../types/UserType'

//css関連
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';

//Contexts
export const UserContext = createContext({} as UserContextType);
export const FlashMessageContext = createContext({} as { FlashState: FlashStateType, FlashDispatch: React.Dispatch<FlashActionType> })

const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}auto_login`

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState({ email: '', id: 0, gravator_url: '', name: '' })
  const UserValue = { user, setUser };

  //FlashMessageをContext化
  const initialflashstate: FlashStateType = { show: true, variant: "primary", message: "message" }
  const [FlashState, FlashDispatch] = useReducer(FlashReducer, initialflashstate);
  const FlashValue: { FlashState: FlashStateType, FlashDispatch: React.Dispatch<FlashActionType> } = { FlashState, FlashDispatch }

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
            FlashDispatch({ type: "DANGER", message: "ページをReloadしてください！" })
            return
          }
          const user_data = data.user
          setUser({ email: user_data.email, id: user_data.id, name: user_data.name, gravator_url: user_data.gravator_url });
          FlashDispatch({ type: "PRIMARY", message: `Welcome back ${user_data.name}` })
        })
    }
  }, []) // [] => changed to => [user]

  return (
    <UserContext.Provider value={UserValue}>
      <FlashMessageContext.Provider value={FlashValue}>
        <Component {...pageProps} />
      </FlashMessageContext.Provider>
    </UserContext.Provider>
  )
}

export default MyApp
