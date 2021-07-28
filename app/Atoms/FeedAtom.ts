import { atom, selector } from "recoil"

type FeedStatusType = {
  length: number,
  FinishLoading: boolean
}

type MicropostType = {
  id: number,
  content: string,
  user_id: number,
  created_at: string,
  gravator_url: string,
  name: string,
  image_url?: string
}

export type FeedContentType = {
  microposts: MicropostType[]
}

export const FeedStatusAtom = atom<FeedStatusType>({
  key: 'FeedStatusAtom',
  default: { length: 0, FinishLoading: false }
})

export const FeedContentAtom = atom<FeedContentType | null>({
  key: 'FeedContentAtom',
  default: null
})

export const FeedUrlSelector = selector<string>({
  key: 'FeedUrlSelector',
  get: ({ get }) => {
    const FeedStatus = get(FeedStatusAtom)
    let FeedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}auto_feed?Limit=30`
    if (FeedStatus && FeedStatus.length > 0) {
      FeedUrl = FeedUrl + `&Offset=` + FeedStatus.length
      return FeedUrl
    }
    return FeedUrl
  }
})

export const FeedReloadUrlSelector = selector<string>({
  key: 'FeedReloadUrlSelector',
  get: ({ get }) => {
    const FeedStatus = get(FeedStatusAtom)
    let FeedReloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL}auto_feed?Offset=0&Limit=30`
    if (FeedStatus && FeedStatus.length > 0) {
      FeedReloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL}auto_feed?Offset=0&Limit=` + FeedStatus.length
    }
    return FeedReloadUrl
  }
})
