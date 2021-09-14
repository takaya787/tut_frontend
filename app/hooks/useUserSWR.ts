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
  id_checker(id:number,user_id: number | undefined): boolean
}

export function useUserSWR(): useUserType {
  const { data: user_data, error: user_error } = useSWR(AutoLoginUrl)

  // user_idとprop_idが等しいか確認する
  const id_checker = (prop_id: number, user_id: number | undefined): boolean => {
    if(!user_id) return false
    return prop_id === user_id;
  };
  return { user_data, user_error,id_checker}
}
