import { useState, useEffect, Dispatch, SetStateAction } from "react";
//Hooks
import { useUserSWR } from "../../hooks/useUserSWR";
//others
import Button from "react-bootstrap/Button";

type MicropostEditProps = {
  id: number;
  isEdit: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
};
export const MicropostEdit: React.FC<MicropostEditProps> = ({ id, isEdit, setIsEdit }) => {
  //ユーザー情報をHookから呼び出し
  const { user_data, has_user_key } = useUserSWR();

  return (
    <>
      {!isEdit && (
        <Button variant="outline-primary" onClick={() => setIsEdit(true)}>
          Edit
        </Button>
      )}
      {isEdit && (
        <Button variant="outline-secondary" onClick={() => setIsEdit(false)}>
          Close
        </Button>
      )}
    </>
  );
};
