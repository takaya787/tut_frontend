import { Dispatch, SetStateAction } from "react";
import { PageStateType } from "../hooks/usePagination";
//Bootstrap
import Pagination from "react-bootstrap/Pagination";

type PaginationPropType = {
  pageState: PageStateType;
  setPageState: Dispatch<SetStateAction<PageStateType>>;
};

//usePaginationのstate関数をそのままぶち込めば、使えるように設定している
export const Pagination_Bar: React.FC<PaginationPropType> = ({ pageState, setPageState }) => {
  const { currentPage, totalPage } = pageState;
  //Paginationの各クリックを関数化
  const ClickNumber = (number: number) => {
    setPageState(Object.assign({ ...pageState }, { currentPage: number }));
  };

  const ClickPrev = (currentPage: number) => {
    let result = 1;
    if (currentPage > 1) {
      result = currentPage - 1;
    } else {
      result = 1;
    }
    setPageState(Object.assign({ ...pageState }, { currentPage: result }));
  };

  const ClickNext = (currentPage: number, totalPage: number) => {
    let result = 1;
    if (currentPage < totalPage) {
      result = currentPage + 1;
    } else {
      result = totalPage;
    }
    setPageState(Object.assign({ ...pageState }, { currentPage: result }));
  };

  //Paginationを表示
  // Paginationの各part
  const Each_Number = (pageNumber: number, currentPage: number): React.ReactElement => {
    return (
      <>
        {pageNumber === currentPage ? (
          <Pagination.Item key={pageNumber} active>
            {pageNumber}
          </Pagination.Item>
        ) : (
          <Pagination.Item key={pageNumber} onClick={() => ClickNumber(pageNumber)}>
            {pageNumber}
          </Pagination.Item>
        )}
      </>
    );
  };

  // Paginationの全体の数
  const Pagination_Numbers = ({
    totalPage,
    currentPage,
  }: {
    totalPage: number;
    currentPage: number;
  }): React.ReactElement => {
    const pagination_array: number[] = [];
    for (var i = 1; i <= totalPage; i++) {
      pagination_array.push(i);
    }
    return (
      <>
        {pagination_array.map((number) => (
          <>{Each_Number(number, currentPage)}</>
        ))}
      </>
    );
  };

  return (
    <Pagination className="justify-content-center">
      <Pagination.First
        key={"First"}
        onClick={() => setPageState(Object.assign({ ...pageState }, { currentPage: 1 }))}
      />
      <Pagination.Prev key={"Prev"} onClick={() => ClickPrev(currentPage)} />
      {Pagination_Numbers({ totalPage: totalPage, currentPage: currentPage })}
      <Pagination.Next key={"Next"} onClick={() => ClickNext(currentPage, totalPage)} />
      <Pagination.Last
        key={"Last"}
        onClick={() => setPageState(Object.assign({ ...pageState }, { currentPage: totalPage }))}
      />
    </Pagination>
  );
};
