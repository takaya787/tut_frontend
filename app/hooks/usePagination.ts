import { useState, Dispatch, SetStateAction } from 'react'

export type PageStateType = {
  currentPage: number,
  totalPage: number,
  maxPerPage: number
}

export type usePaginationType = {
  pageState: PageStateType,
  setPageState: Dispatch<SetStateAction<PageStateType>>
}

// このように呼び出すと良い
// //Pagination用のstate管理
// const { pageState, setPageState } = usePagination({ maxPerPage: Number })
// //各keyを定数として固定しておく
// const { currentPage, totalPage, maxPerPage } = pageState

export function usePagination({ maxPerPage }: { maxPerPage: number }): usePaginationType {
  //Pagination用のstate管理
  const [pageState, setPageState] = useState<PageStateType>({
    currentPage: 1,
    totalPage: 0,
    maxPerPage: maxPerPage
  });

  return { pageState, setPageState }
}
