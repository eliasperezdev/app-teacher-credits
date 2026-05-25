export const raffleKeys = {
  all: ['raffles'],
  lists: (sessionId) => [...raffleKeys.all, 'list', sessionId],
  details: () => [...raffleKeys.all, 'detail'],
  detail: (id) => [...raffleKeys.details(), id],
};
