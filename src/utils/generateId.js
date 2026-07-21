export const generateId = (data) => {
  if (data.length === 0) return 1

  const dataIDs = data.map(item => item.id)
  return Math.max(...dataIDs) + 1
}
