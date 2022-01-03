import { atom } from "recoil";
import { FlashStateType } from "../types/FlashType";

const initialFlashState: FlashStateType = { show: false, variant: "primary", message: "" };

export const FlashMessageAtom = atom<FlashStateType>({
  key: "FlashMessageAtom",
  default: initialFlashState,
});
