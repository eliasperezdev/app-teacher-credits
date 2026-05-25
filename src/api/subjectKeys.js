export const subjectKeys = {
  all: ['subjects'],
  lists: () => [...subjectKeys.all, 'list'],
  list: (filters) => [...subjectKeys.lists(), filters],
  details: () => [...subjectKeys.all, 'detail'],
  detail: (id) => [...subjectKeys.details(), id],
};
