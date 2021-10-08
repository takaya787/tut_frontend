import { useState } from "react";
import { MicropostType } from "../../types/Micropost";

type MicropostLikeInfoProps = {
  post: MicropostType;
};

export const MicropostLikeInfo: React.FC<MicropostLikeInfoProps> = ({ post }) => {
  const [likedNumber, setLikedNumber] = useState(0);

  return <></>;
};
