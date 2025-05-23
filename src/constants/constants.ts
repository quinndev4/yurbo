const COLLECTIONS = {
  TEST: 'test',
  USERS: 'users',
  YURBOS: 'yurbos',
  EVENTS: 'events',
  LOCATIONS: 'locations',
  FOLLOWING: 'following',
  FOLLOWERS: 'followers',
};

const ROUTES = {
  yurbos: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/${COLLECTIONS.YURBOS}`,
  events: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/${COLLECTIONS.EVENTS}`,
  locations: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/${COLLECTIONS.LOCATIONS}`,
  friends: (id?: string) => `/api/${COLLECTIONS.USERS}/${id}/friends`,
  followers: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/friends?query=followers`,
  followees: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/friends?query=following`,
};

export const C = { COLLECTIONS, ROUTES };
