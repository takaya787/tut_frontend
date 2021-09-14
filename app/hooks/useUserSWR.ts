import useSWR from 'swr';
//type
import { MicropostType } from '../types/Micropost'
export const AutoLoginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}auto_login`

type UserDataType = {
  user: { email: string, id: number, gravator_url: string, name: string, activated: boolean, activated_at: string, microposts: MicropostType[] }
}

type useUserType = {
  user_data: UserDataType | null | undefined,
  user_error: string | null,
  has_user_key(): boolean,
}

export function useUserSWR(): useUserType {
  const { data: user_data, error: user_error } = useSWR(AutoLoginUrl)

  const has_user_key = (): boolean => {
    if (user_data) {
      return user_data.hasOwnProperty('user')
    } else {
      return false
    }
  }
  return { user_data, user_error, has_user_key }
}
