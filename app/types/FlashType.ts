//Flash Messageのstate用type
export type FlashStateType = {
  show: boolean, variant: "primary" | "success" | "danger" | "info", message?: string
}


//Actionのtypeでは大文字で,switchで分けやすいようにしておく。variantはaction側では設けない
export type FlashActionType = {
  type: "PRIMARY" | "SUCCESS" | "DANGER" | "INFO" | "HIDDEN",
  message?: string
}
