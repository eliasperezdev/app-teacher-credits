export const raffleKeys = {
  all: ['raffles'],
  lists: (sessionId) => [...raffleKeys.all, 'list', sessionId],
  pool: (sessionId) => [...raffleKeys.all, 'pool', sessionId],
  details: () => [...raffleKeys.all, 'detail'],
  detail: (id) => [...raffleKeys.details(), id],
};
