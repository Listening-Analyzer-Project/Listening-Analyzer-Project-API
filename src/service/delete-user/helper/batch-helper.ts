export const deleteInBatches = (
  ids: number[],
  model: { deleteMany: (ids: number[]) => any },
  batchSize = 500
) => {
  if (!ids.length) return 0;

  let totalDeleted = 0;
  for (let i = 0; i < ids.length; i += batchSize) {
    const chunk = ids.slice(i, i + batchSize);
    const { deletedCount } = model.deleteMany(chunk);
    totalDeleted += deletedCount ?? 0;
  }

  return totalDeleted;
};
