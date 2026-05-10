export const COLUMNS = [
  { id: 'ideas',         label: 'Ideas',          color: '#8B5CF6', lightBg: '#EDE9FE' },
  { id: 'scripted',      label: 'Scripted',        color: '#3B82F6', lightBg: '#DBEAFE' },
  { id: 'in-production', label: 'In Production',   color: '#F59E0B', lightBg: '#FEF3C7' },
  { id: 'published',     label: 'Published',       color: '#10B981', lightBg: '#D1FAE5' },
  { id: 'analyzed',      label: 'Analyzed',        color: '#6366F1', lightBg: '#E0E7FF' },
]

export const PLATFORMS = {
  youtube:   { label: 'YouTube',    bg: 'bg-red-500',      text: 'text-white' },
  instagram: { label: 'Instagram',  bg: 'bg-pink-500',     text: 'text-white' },
  twitter:   { label: 'Twitter/X',  bg: 'bg-sky-400',      text: 'text-white' },
  blog:      { label: 'Blog',       bg: 'bg-emerald-500',  text: 'text-white' },
  linkedin:  { label: 'LinkedIn',   bg: 'bg-blue-600',     text: 'text-white' },
}

export const FORMATS = {
  youtube:   ['Video', 'Short', 'Live'],
  instagram: ['Reel', 'Post', 'Story', 'Carousel'],
  twitter:   ['Post', 'Thread'],
  blog:      ['Article', 'Newsletter'],
  linkedin:  ['Post', 'Article', 'Newsletter'],
}

export const CONTENT_TYPES = [
  { id: 'video',   label: 'Video' },
  { id: 'blog',    label: 'Blog' },
  { id: 'podcast', label: 'Podcast' },
  { id: 'social',  label: 'Social' },
]

export const COLOR_OPTIONS = [
  '#EF4444',
  '#F97316',
  '#EAB308',
  '#22C55E',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
]

export const COLUMN_IDS = COLUMNS.map(c => c.id)
