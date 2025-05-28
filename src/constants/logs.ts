export const LOGS = {
  EVENT: {
    CREATING: 'Request received to create event',
    CREATED: 'Event successfully created',
    GOT: 'EVENTS successfully retrieved',
  },
  YURBO: {
    CREATING: 'Request received to create Yurbo',
    CREATED: 'Yurbo successfully created',
    GOT: 'Yurbos successfully retrieved',
  },
  LOCATION: {
    CREATING: 'Request received to create location',
    CREATED: 'Location successfully created',
    GOT: 'Locations successfully retrieved',
  },
  FRIEND: {
    created: (email: string) => `Friend (${email}) successfully created`,
    GOT: 'Following successfully retrieved',
  },
};
