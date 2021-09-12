import useSWR from 'swr';

export const AutoLikesUrl = `${process.env.NEXT_PUBLIC_BASE_URL}auto_likes`

type LikesData = {
  liked_microposts: number[]
}

type useLikesType = {
  likes_data: LikesData | null | undefined,
  likes_error: string | null
}

export function useLikesSWR():useLikesType {
  const { data: likes_data, error: likes_error } = useSWR(AutoLikesUrl);

  return { likes_data,likes_error}
}
