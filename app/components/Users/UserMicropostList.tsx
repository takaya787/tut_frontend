import React from "react";
import Link from 'next/link'
//Component
import { MicropostCard } from '../Micropost/MicropostCard'
//types
import { MicropostType } from '../../types/Micropost'

type MicropostListProps = {
  microposts: MicropostType[],
  gravator_url: string,
  name: string,
  currentPage: number,
  maxPerPage: number,
  count: boolean
}

export const UserMicropostList: React.FC<MicropostListProps> = ({ microposts, gravator_url, name, currentPage, maxPerPage, count }) => {

  //MicroPostの個数を計算
  const count_Microposts = (): number => {
    if (microposts) {
      return microposts.length
    } else {
      return 0
    }
  }

  //Paginationの開始と終了時点を計算する
  const start_index = (currentPage - 1) * maxPerPage;
  const end_index = start_index + maxPerPage;

  return (
    <section>
      {count && (
        <h3>Microposts  ({count_Microposts()})</h3>
      )}
      <ul className="microposts">
        {microposts.slice(start_index, end_index).map(post =>
        (<li key={post.id} id={`micropost-${post.id}`}>
          <MicropostCard post={post} gravator_url={gravator_url} name={name} />
        </li>
        ))
        }
      </ul>
    </section>
  )
}
