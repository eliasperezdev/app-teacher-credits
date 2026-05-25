export const commissionKeys = {
  all: ['commissions'],
  lists: (subjectId) => [...commissionKeys.all, 'list', subjectId],
  details: () => [...commissionKeys.all, 'detail'],
  detail: (id) => [...commissionKeys.details(), id],
};
