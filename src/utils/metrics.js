export function formatCount(n) {
  if (n == null || n === 0) return null
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

export function computeEngagementRate(metrics) {
  const { views, likes, comments, shares } = metrics
  if (!views || views === 0) return null
  const interactions = (likes || 0) + (comments || 0) + (shares || 0)
  return ((interactions / views) * 100).toFixed(1)
}
