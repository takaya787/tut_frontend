export type FollowType = {
  id: number,
  name: string,
  gravator_url: string
}

export type RelationshipsType = {
  relationships: {
    following: FollowType[],
    followers: FollowType[]
  }
}
