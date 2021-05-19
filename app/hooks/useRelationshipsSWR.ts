import React from 'react';
import useSWR from 'swr';
import { Auth } from '../modules/Auth'
export const AutoRelationshipsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}auto_relationships`

type FollowType = {
  id: number,
  name: string,
  gravator_url: string
}

type RelationshipsType = {
  relationships: {
    following: FollowType[],
    followers: FollowType[]
  }
}

// SWR用のfetcher
async function RelationshipsFetcher(id: number): Promise<RelationshipsType | null> {

  const response = await fetch(AutoRelationshipsUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${Auth.getToken()}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json()
}

type useRelationshipsType = {
  relationships_data: RelationshipsType | null,
  relationships_error: string | null,
  has_relationships_key(): boolean,
}

export function useRelationshipsSWR(): useRelationshipsType {
  const { data: relationships_data, error: relationships_error } = useSWR(AutoRelationshipsUrl, RelationshipsFetcher)

  const has_relationships_key = (): boolean => {
    return relationships_data.hasOwnProperty('relationships')
  }
  return { relationships_data, relationships_error, has_relationships_key }
}
