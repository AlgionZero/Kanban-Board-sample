const now = new Date().toISOString()

function card(overrides) {
  return {
    id: '', title: '', description: '', platform: 'youtube', contentType: 'video',
    format: 'Video', column: 'analyzed', color: null, thumbnailUrl: null, tags: [],
    dueDate: null, publishedDate: null, contentUrl: null, notes: '',
    metrics: { views: 0, likes: 0, comments: 0, shares: 0, watchTimeMins: null, engagementRate: null },
    createdAt: now, updatedAt: now,
    ...overrides,
  }
}

export const sampleData = [
  // ── Pipeline cards (no metrics yet) ────────────────────────────────────────
  card({
    id: 'sample-1', title: 'Behind-the-scenes: my content workflow',
    description: 'Show how I plan, script, film, and edit a full YouTube video from start to finish.',
    platform: 'youtube', column: 'ideas', color: '#8B5CF6',
  }),
  card({
    id: 'sample-2', title: '5 tools every creator needs in 2026',
    description: 'Roundup post covering AI tools, scheduling apps, and analytics platforms.',
    platform: 'blog', contentType: 'blog', format: 'Article', column: 'ideas', color: '#22C55E',
  }),
  card({
    id: 'sample-3', title: 'How I grew to 10k followers organically',
    description: 'Thread breaking down the exact strategy, posting cadence, and content types that worked.',
    platform: 'twitter', contentType: 'social', format: 'Thread', column: 'scripted',
    color: '#3B82F6', dueDate: '2026-05-20',
    notes: 'Lead with the result, then break down into 8 tweets.',
  }),
  card({
    id: 'sample-4', title: 'Morning routine for creators',
    description: 'Quick Reel showing 5am–8am routine including journaling, workout, and content planning.',
    platform: 'instagram', format: 'Reel', column: 'in-production', color: '#EC4899',
    dueDate: '2026-05-15', notes: 'B-roll of desk setup already filmed. Need voiceover.',
  }),

  // ── May 2026 ────────────────────────────────────────────────────────────────
  card({
    id: 'sample-m1', title: 'Creator burnout — my story',
    description: 'Honest video about hitting a wall and how I recovered my motivation.',
    platform: 'youtube', column: 'published', color: '#EF4444',
    publishedDate: '2026-05-02', contentUrl: 'https://youtube.com',
    metrics: { views: 11800, likes: 490, comments: 97, shares: 183, watchTimeMins: 5.9, engagementRate: 4.5 },
  }),

  // ── April 2026 ──────────────────────────────────────────────────────────────
  card({
    id: 'sample-5', title: 'LinkedIn growth masterclass',
    description: 'Step-by-step newsletter issue on optimizing your LinkedIn profile and posting strategy.',
    platform: 'linkedin', contentType: 'blog', format: 'Newsletter', column: 'published',
    color: '#3B82F6', publishedDate: '2026-04-28', contentUrl: 'https://linkedin.com',
    metrics: { views: 3200, likes: 241, comments: 38, shares: 54, watchTimeMins: null, engagementRate: null },
  }),
  card({
    id: 'sample-6', title: 'YouTube algorithm explained in 10 minutes',
    description: 'Deep-dive video on how the recommendation system works and how to optimize for it.',
    platform: 'youtube', column: 'analyzed', color: '#EF4444',
    publishedDate: '2026-04-10', contentUrl: 'https://youtube.com',
    metrics: { views: 48200, likes: 1870, comments: 203, shares: 412, watchTimeMins: 7.4, engagementRate: 5.1 },
    notes: 'Strong retention up to minute 7. Drop-off on the "shorts" section — cut that next time.',
  }),

  // ── March 2026 ──────────────────────────────────────────────────────────────
  card({
    id: 'sample-m2', title: 'How I edit a full video in under 2 hours',
    platform: 'youtube', column: 'analyzed', color: '#F59E0B',
    publishedDate: '2026-03-18', contentUrl: 'https://youtube.com',
    metrics: { views: 41200, likes: 1660, comments: 198, shares: 374, watchTimeMins: 9.3, engagementRate: 6.1 },
    notes: 'Best performing video this month. Hook in first 15s made the difference.',
  }),
  card({
    id: 'sample-m3', title: 'Twitter/X growth blueprint',
    platform: 'twitter', contentType: 'social', format: 'Thread', column: 'analyzed',
    color: '#38BDF8', publishedDate: '2026-03-28',
    metrics: { views: 27500, likes: 1840, comments: 304, shares: 672, watchTimeMins: null, engagementRate: 9.7 },
  }),
  card({
    id: 'sample-m4', title: 'Monthly creator recap — March',
    platform: 'linkedin', contentType: 'blog', format: 'Newsletter', column: 'analyzed',
    color: '#3B82F6', publishedDate: '2026-03-31',
    metrics: { views: 5900, likes: 421, comments: 79, shares: 118, watchTimeMins: null, engagementRate: 6.3 },
  }),

  // ── February 2026 ───────────────────────────────────────────────────────────
  card({
    id: 'sample-m5', title: 'My camera & desk setup tour 2026',
    platform: 'youtube', column: 'analyzed', color: '#EF4444',
    publishedDate: '2026-02-22', contentUrl: 'https://youtube.com',
    metrics: { views: 32100, likes: 1310, comments: 177, shares: 322, watchTimeMins: 8.1, engagementRate: 5.6 },
  }),
  card({
    id: 'sample-m6', title: 'Valentine\'s Day collab reel',
    platform: 'instagram', format: 'Reel', column: 'analyzed',
    color: '#EC4899', publishedDate: '2026-02-13',
    metrics: { views: 14600, likes: 1080, comments: 207, shares: 311, watchTimeMins: null, engagementRate: 7.3 },
  }),

  // ── January 2026 ────────────────────────────────────────────────────────────
  card({
    id: 'sample-m7', title: 'My 2026 content strategy (full breakdown)',
    platform: 'youtube', column: 'analyzed', color: '#8B5CF6',
    publishedDate: '2026-01-10', contentUrl: 'https://youtube.com',
    metrics: { views: 24300, likes: 970, comments: 148, shares: 226, watchTimeMins: 6.5, engagementRate: 5.3 },
    notes: 'First video of the year. Strong start — strategy videos always do well in January.',
  }),
  card({
    id: 'sample-m8', title: 'Productivity hacks for content creators',
    platform: 'blog', contentType: 'blog', format: 'Article', column: 'analyzed',
    color: '#10B981', publishedDate: '2026-01-25',
    metrics: { views: 3900, likes: 292, comments: 51, shares: 98, watchTimeMins: null, engagementRate: 6.4 },
  }),

  // ── December 2025 ───────────────────────────────────────────────────────────
  card({
    id: 'sample-m9', title: 'Year in review: 2025 creator edition',
    platform: 'youtube', column: 'analyzed', color: '#EF4444',
    publishedDate: '2025-12-20', contentUrl: 'https://youtube.com',
    metrics: { views: 19200, likes: 740, comments: 104, shares: 178, watchTimeMins: 6.0, engagementRate: 4.8 },
    notes: 'Emotional video — comments were very engaged. Good format to repeat.',
  }),
  card({
    id: 'sample-m10', title: 'My productivity system for December',
    platform: 'instagram', format: 'Carousel', column: 'analyzed',
    color: '#EC4899', publishedDate: '2025-12-06',
    metrics: { views: 9400, likes: 695, comments: 121, shares: 243, watchTimeMins: null, engagementRate: 7.9 },
  }),
]
