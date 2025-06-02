const COLLECTIONS = {
  TEST: 'test',
  USERS: 'users',
  YURBOS: 'yurbos',
  EVENTS: 'events',
  LOCATIONS: 'locations',
  FOLLOWERS: 'followers',
};

const ROUTES = {
  yurbos: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/${COLLECTIONS.YURBOS}`,
  events: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/${COLLECTIONS.EVENTS}`,
  locations: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/${COLLECTIONS.LOCATIONS}`,
  friends: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/friends?query=following`,
  followers: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/friends?query=followers`,
  following: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/friends?query=following`,
<<<<<<< HEAD
  user: (id?: string) => `/api/${COLLECTIONS.USERS}/${id}`,
=======
  user: (id?: string, query?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}?query=${query}`,
>>>>>>> Adding shit that i changed - im adding a commit message!
};

export const C = { COLLECTIONS, ROUTES };
