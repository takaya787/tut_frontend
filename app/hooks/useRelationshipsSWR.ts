import useSWR from "swr";
//type
import { RelationshipsType } from "../types/FollowType";

export const AutoRelationshipsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}auto_relationships`;

type useRelationshipsType = {
  relationships_data: RelationshipsType | null | undefined;
  relationships_error: string | null;
  has_following_key(): boolean;
  has_followers_key(): boolean;
  Is_following_func(id: number): boolean;
};

export function useRelationshipsSWR(): useRelationshipsType {
  const { data: relationships_data, error: relationships_error } = useSWR(AutoRelationshipsUrl, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  const has_following_key = (): boolean => {
    if (relationships_data?.relationships) {
      return relationships_data.relationships.hasOwnProperty("following");
    } else {
      return false;
    }
  };

  const has_followers_key = (): boolean => {
    if (relationships_data?.relationships) {
      return relationships_data.relationships.hasOwnProperty("followers");
    } else {
      return false;
    }
  };

  const Is_following_func = (id: number): boolean => {
    if (relationships_data?.following_index) {
      return relationships_data.following_index.includes(id);
    } else {
      return false;
    }
  };

  return {
    relationships_data,
    relationships_error,
    Is_following_func,
    has_followers_key,
    has_following_key,
  };
}
