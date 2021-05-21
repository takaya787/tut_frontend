import React from 'react';
import useSWR from 'swr';
//Module
import { Auth } from '../modules/Auth'
import { RelationshipsType } from '../types/FollowType'
export const AutoRelationshipsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}auto_relationships`

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
  has_following_key(): boolean,
  has_followers_key(): boolean,
  has_Index_keys(): boolean,
  Is_following_func(id: number): boolean
}

export function useRelationshipsSWR(): useRelationshipsType {
  const { data: relationships_data, error: relationships_error } = useSWR(AutoRelationshipsUrl, RelationshipsFetcher)

  const has_following_key = (): boolean => {
    if (relationships_data.hasOwnProperty('relationships')) {
      return relationships_data.relationships.hasOwnProperty('following')
    } else {
      false
    }
  }

  const has_followers_key = (): boolean => {
    if (relationships_data.hasOwnProperty('relationships')) {
      return relationships_data.relationships.hasOwnProperty('followers')
    } else {
      false
    }
  }

  const has_Index_keys = (): boolean => {
    if (relationships_data.hasOwnProperty('following_index') && relationships_data.hasOwnProperty('followers_index')) {
      return true
    } else {
      return false
    }
  }

  const Is_following_func = (id: number): boolean => {
    return relationships_data.following_index.includes(id)
  }

  return { relationships_data, relationships_error, has_following_key, has_followers_key, has_Index_keys, Is_following_func }
}
