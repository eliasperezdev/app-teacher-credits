export const sessionKeys = {
  all: ['sessions'],
  lists: (commissionId) => [...sessionKeys.all, 'list', commissionId],
  details: () => [...sessionKeys.all, 'detail'],
  detail: (id) => [...sessionKeys.details(), id],
};
