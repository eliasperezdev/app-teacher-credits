export const groupKeys = {
  all: ['groups'],
  lists: (commissionId) => [...groupKeys.all, 'list', commissionId],
  details: () => [...groupKeys.all, 'detail'],
  detail: (id) => [...groupKeys.details(), id],
};
