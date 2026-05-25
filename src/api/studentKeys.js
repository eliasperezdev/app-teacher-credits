export const studentKeys = {
  all: ['students'],
  lists: (commissionId) => [...studentKeys.all, 'list', commissionId],
  details: () => [...studentKeys.all, 'detail'],
  detail: (id) => [...studentKeys.details(), id],
};
