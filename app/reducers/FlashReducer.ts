//types
import { FlashStateType, FlashActionType } from '../types/FlashType'
export function FlashReducer(state: FlashStateType, action: FlashActionType): FlashStateType {
  switch (action.type) {
    case "DANGER":
      return { ...state, show: true, variant: "danger", message: action.message };
    case "INFO":
      return { ...state, show: true, variant: "info", message: action.message };
    case "PRIMARY":
      return { ...state, show: true, variant: "primary", message: action.message };
    case "SUCCESS":
      return { ...state, show: true, variant: "success", message: action.message };
    // これはflash messageの表示をやめるコマンド
    case "HIDDEN":
      return { ...state, show: false };
    default:
      return state;
  }
}
