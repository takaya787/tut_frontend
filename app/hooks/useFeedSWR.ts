import useSWR from 'swr';
//Module
import { Auth } from '../modules/Auth'
export const AutoFeedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}auto_feed`

type MicropostType = {
  id: number,
  content: string,
  user_id: number,
  created_at: string,
  gravator_url: string,
  name: string,
  image_url?: string
}

type FeedType = {
  microposts: MicropostType[]
}
// SWR用のfetcher
async function RelationshipsFetcher(id: number): Promise<FeedType | null> {
  const response = await fetch(AutoFeedUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${Auth.getToken()}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json()
}

type useFeedType = {
  feed_data: FeedType | null | undefined,
  feed_error: string | null,
  has_microposts_key(): boolean,
}

export function useFeedSWR(): useFeedType {
  const { data: feed_data, error: feed_error } = useSWR(AutoFeedUrl, RelationshipsFetcher)

  const has_microposts_key = (): boolean => {
    if (feed_data) {
      return feed_data.hasOwnProperty('microposts')
    }
    return false
  }

  return { feed_data, feed_error, has_microposts_key }
}
