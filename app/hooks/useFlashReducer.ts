//Atoms
import { FlashMessageAtom } from '../Atoms/FlashMessageAtom';
import { useRecoilState } from 'recoil';
import { FlashActionType, FlashStateType } from '../types/FlashType';

export const useFlashReducer = (): { FlashReducer: Function } => {
  //Flash Message Atomを読み込み
  const [FlashAtom, setFlashAtom] = useRecoilState(FlashMessageAtom)

  const FlashReducer = (action: FlashActionType) => {
    let newState: FlashStateType = { show: false, variant: "primary", message: "message" }

    switch (action.type) {
      case "DANGER":
        newState = { ...FlashAtom, show: true, variant: "danger", message: action.message }
        break;
      case "INFO":
        newState = { ...FlashAtom, show: true, variant: "info", message: action.message }
        break;
      case "PRIMARY":
        newState = { ...FlashAtom, show: true, variant: "primary", message: action.message }
        break;
      case "SUCCESS":
        newState = { ...FlashAtom, show: true, variant: "success", message: action.message }
        break;
      // これはflash messageの表示をやめるコマンド
      case "HIDDEN":
        newState = { ...FlashAtom, show: false };
        break;
      default:
        newState = { ...FlashAtom }
    }

    setFlashAtom(newState)
  }

  return { FlashReducer }
}
