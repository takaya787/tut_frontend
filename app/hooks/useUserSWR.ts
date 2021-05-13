import useSWR from 'swr';
//others
import { Auth } from '../modules/Auth'
//type
import { MicropostType } from '../types/Micropost'
export const AutoLoginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}auto_login`

type UserDataType = {
  user: { email: string, id: number, gravator_url: string, name: string, activated: boolean, activated_at: string, microposts: MicropostType[] }
}

// SWR用のfetcher
async function UserFetcher(): Promise<UserDataType | null> {
  const response = await fetch(AutoLoginUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${Auth.getToken()}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json()
}
type useUserType = {
  user_data: UserDataType | null,
  user_error: string | null,
  has_user_key(): boolean,
}

export function useUserSWR(): useUserType {
  const { data: user_data, error: user_error } = useSWR(AutoLoginUrl, UserFetcher)

  const has_user_key = (): boolean => {
    return user_data.hasOwnProperty('user')
  }
  return { user_data, user_error, has_user_key }
}
