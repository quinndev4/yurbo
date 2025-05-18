const COLLECTIONS = {
  TEST: 'test',
  USERS: 'users',
  YURBOS: 'yurbos',
  EVENTS: 'events',
  LOCATIONS: 'locations',
};

const ROUTES = {
  yurbos: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/${COLLECTIONS.YURBOS}`,
  events: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/${COLLECTIONS.EVENTS}`,
  locations: (id?: string) =>
    `/api/${COLLECTIONS.USERS}/${id}/${COLLECTIONS.LOCATIONS}`,
};

export const C = { COLLECTIONS, ROUTES };
