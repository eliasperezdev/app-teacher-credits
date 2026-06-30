export const creditKeys = {
  all: ['credits'],
  lists: (groupId) => [...creditKeys.all, 'list', groupId],
  summaries: (commissionId) => [...creditKeys.all, 'summary', commissionId],
  details: () => [...creditKeys.all, 'detail'],
  detail: (id) => [...creditKeys.details(), id],
  redemptions: (memberId) => [...creditKeys.all, 'redemptions', memberId],
  redeemablePoints: (memberId) => [...creditKeys.all, 'redeemable-points', memberId],
};
