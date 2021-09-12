import React, { useEffect, useState } from "react";
import { mutate } from "swr";
// material-icon
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
//module
import { Auth } from "../../modules/Auth";
// hooks
import { useLikesSWR, AutoLikesUrl } from "../../hooks/useLikesSWR";
import { configure } from "@testing-library/dom";

type MicropostLikeProps = {
  id: number;
};

export const MicropostLike: React.FC<MicropostLikeProps> = ({ id }) => {
  const Likes_Create_Url = process.env.NEXT_PUBLIC_BASE_URL + "likes?micropost_id=" + id;
  const Likes_Delete_Url = process.env.NEXT_PUBLIC_BASE_URL + "likes?micropost_id=" + id;

  const { likes_data, likes_error } = useLikesSWR();
  //ハートの状態を管理するfavoを定義(初期値はfalse)
  const [isLike, setIslike] = useState(false);

  useEffect(() => {
    if (!likes_data || !likes_data?.liked_microposts) return;
    if (likes_data.liked_microposts) {
      const index = likes_data.liked_microposts;
      if (index.includes(id)) {
        setIslike(true);
      }
    }
  }, [likes_data]);

  //アイコンをクリックしたらlikesのAPIを叩く
  const handleClick = () => {
    if (isLike === false) {
      const Post_Config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${Auth.getToken()}`,
        },
      };
      fetch(Likes_Create_Url, Post_Config).then((res) => {
        if (!res.ok) return;
        setIslike(true);
      });
    } else {
      const Delete_Config = {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${Auth.getToken()}`,
        },
      };
      fetch(Likes_Delete_Url, Delete_Config).then((res) => {
        if (!res.ok) return;
        setIslike(false);
      });
    }
  };

  return (
    <>
      <IconButton onClick={() => handleClick()} size="small">
        {isLike ? <FavoriteIcon color={"secondary"} /> : <FavoriteBorderIcon />}
      </IconButton>
    </>
  );
};
