import { Dispatch, SetStateAction, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
//Atom
import { FeedStatusAtom, FeedContentAtom, FeedUrlSelector, FeedContentType } from '../Atoms/FeedAtom';
//Module
import { Auth } from '../modules/Auth';

type useFeedFetchType = {
  handleFetching(): Promise<void>,
  isFetchLoading: boolean,
  setIsFetchLoading: Dispatch<SetStateAction<boolean>>
}

export const useFeedFetch = (): useFeedFetchType => {
  //Loadingの状態を所持
  const [isFetchLoading, setIsFetchLoading] = useState<boolean>(true)
  //FeedのAtomを呼び出し
  const [FeedStatus, setFeedStatus] = useRecoilState(FeedStatusAtom)
  const [FeedContent, setFeedContent] = useRecoilState(FeedContentAtom)
  const SelectoredFeedUrl = useRecoilValue(FeedUrlSelector)

  async function fetchFeedContents(): Promise<FeedContentType> {
    console.log({ SelectoredFeedUrl })
    const response = await fetch(SelectoredFeedUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Auth.getToken()}`,
        'Content-Type': 'application/json'
      }
    });
    const json = await response.json()
    // console.log({ json })
    return json
  }

  const handleFetching = async () => {
    const result = await fetchFeedContents()
    // console.log({ result })
    // Statusの長さが1以上の場合、新しいnewResultを設定して追加
    if (FeedContent && FeedStatus.length != 0) {
      const newResult = { microposts: FeedContent.microposts.concat(result.microposts) }
      console.log({ newResult })
      setFeedContent(newResult)
      setFeedStatus({ length: newResult.microposts.length, startFetching: false })
    } else {
      // Statusの長さが0の場合、直接resultを追加
      setFeedContent(result)
      setFeedStatus({ length: result.microposts.length, startFetching: false })
    }
    setIsFetchLoading(false)
  }

  return {
    handleFetching, isFetchLoading, setIsFetchLoading
  }
}
