//Errorを所持するためのCustom Hook
import { useState } from 'react';

//type 一覧
type initialerrorsType = {
  [key: string]: string
}
//Error Dataの要素は配列で送られる
type ErrorDataType = {
  [key: string]: string[]
}
type useFormType = {
  errors: initialerrorsType,
  handleError(data: ErrorDataType): void,
  resetError: VoidFunction,
}

//formの要素ごとのkeyを設定して、各keyごとにerror messageを追加
export function useFormErrors(initialerrors: initialerrorsType): useFormType {
  //（例） const initialerrors = { name: '', email: '', password: '', password_confirmation: '' };
  const [errors, setErrors] = useState<initialerrorsType>(initialerrors);
  const handleError = (data: ErrorDataType) => {
    let errors_copy = Object.assign({}, initialerrors);
    Object.keys(data).forEach(
      function (key) {
        // console.log(key + ' =  ' + data[key]);
        errors_copy = { ...errors_copy, [key]: data[key][0] };
        setErrors(errors_copy);
      }
    )
  }
  const resetError = () => {
    setErrors(initialerrors);
  }

  return { errors, handleError, resetError }
}
