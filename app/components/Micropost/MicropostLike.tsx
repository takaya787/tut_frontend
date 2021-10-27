import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import useSWRImmutable from "swr/immutable";
// material-icon
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
//module
import { Auth } from "../../modules/Auth";
// hooks
import { useLikesSWR } from "../../hooks/useLikesSWR";

type MicropostLikeProps = {
  id: number;
};

export const MicropostLike: React.FC<MicropostLikeProps> = ({ id }) => {
  const Likes_Create_Url = process.env.NEXT_PUBLIC_BASE_URL + "likes?micropost_id=" + id;
  const Likes_Delete_Url = process.env.NEXT_PUBLIC_BASE_URL + "likes?micropost_id=" + id;
  const Likes_Count_Url = process.env.NEXT_PUBLIC_BASE_URL + "microposts/" + id;

  const { mutate } = useSWRConfig();

  const { likes_data, likes_error } = useLikesSWR();

  //ハートの状態を管理するfavoを定義(初期値はfalse)
  const [isLike, setIslike] = useState(false);

  //Liked_countをSWRで取得
  const { data, error } = useSWRImmutable(Likes_Count_Url);

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
  const handleClick = async () => {
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
    await new Promise((f) => setTimeout(f, 500));
    mutate(Likes_Count_Url);
  };

  return (
    <>
      <IconButton onClick={() => handleClick()} size="small">
        {isLike ? <FavoriteIcon color={"secondary"} /> : <FavoriteBorderIcon />}
        <span style={{ marginLeft: "10px" }}>{data?.micropost?.liked}</span>
      </IconButton>
    </>
  );
};
