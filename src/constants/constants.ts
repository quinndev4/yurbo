const COLLECTIONS = {
  TEST: 'test',
  USERS: 'users',
  YURBOS: 'yurbos',
  EVENTS: 'events',
  LOCATIONS: 'locations',
  FOLLOWERS: 'followers',
};

const ROUTES = {
  yurbos: (id?: string, query?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/${COLLECTIONS.YURBOS}${query ? `?query=${query}` : ''}`,
  events: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/${COLLECTIONS.EVENTS}`,
  locations: (id?: string, query?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/${COLLECTIONS.LOCATIONS}${query ? `?query=${query}` : ''}`,
  friends: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/friends?query=following`,
  followers: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/friends?query=followers`,
  following: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/friends?query=following`,
  user: (id?: string) => `/api/${COLLECTIONS.USERS}/${id}`,
  users: (query?: string) => `/api/${COLLECTIONS.USERS}?query=${query}`,
};

export const C = { COLLECTIONS, ROUTES };
