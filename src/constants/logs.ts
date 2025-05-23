export const LOGS = {
  EVENT: {
    CREATED: 'Event successfully created',
    GOT: 'EVENTS successfully retrieved',
  },
  YURBO: {
    CREATED: 'Yurbo successfully created',
    GOT: 'Yurbos successfully retrieved',
  },
  LOCATION: {
    CREATED: 'Location successfully created',
    GOT: 'Locations successfully retrieved',
  },
  FRIEND: {
    created: (email: string) => `Friend (${email}) successfully created`,
    GOT: 'Following successfully retrieved',
  },
};
