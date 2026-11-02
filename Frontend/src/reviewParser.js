// Splits the AI's markdown review into titled sections and assigns each a
// severity so the UI can render them as cards. Display only: the raw markdown
// is still what gets copied.

const FENCE = /^\s*(```|~~~)/
const HEADING = /^\s{0,3}#{1,4}\s+(.+?)\s*#*\s*$/
const BOLD_TITLE = /^\s*(?:\*\*|__)([^*_]{2,70})(?:\*\*|__)\s*:?\s*$/
const EMOJI_TITLE = /^\s*(?:\*\*|__)?\s*(?:❌|⚠️|⚠|🔍|✅|💡|🚀|📌|🛠️|🛠|🔒|🔐|✔️|✔|🐞|🐛|⚡|📝|🚨)/u
const LEADING_SYMBOLS = /^(?:[\s\p{Extended_Pictographic}*_:•-]|️|‍)+/u
const TRAILING = /[\s*_:]+$/

const RULES = [
  { sev: 'critical', emoji: /❌|🚨|🐞|🐛/u, words: /critical|bad code|\berror|\bbugs?\b|vulnerab|security|\bissues?\b|problem|danger|injection/i },
  { sev: 'warning', emoji: /⚠/u, words: /warning|performance|caution|potential|\brisks?\b|concern|smell/i },
  { sev: 'success', emoji: /✅|✔/u, words: /recommended|\bfix(ed|es)?\b|corrected|improved code|refactor|strength|what.?s good|positive|well done/i },
]

export const SEVERITY_LABEL = {
  critical: 'Critical',
  warning: 'Warning',
  success: 'Recommended',
  info: 'Note',
}

function classify(rawTitle) {
  for (const r of RULES) if (r.emoji.test(rawTitle)) return r.sev
  for (const r of RULES) if (r.words.test(rawTitle)) return r.sev
  return 'info'
}

function cleanTitle(raw) {
  return raw.replace(LEADING_SYMBOLS, '').replace(TRAILING, '').replace(/\*\*|__/g, '').trim()
}

function titleOf(line) {
  const h = line.match(HEADING)
  if (h) return h[1]
  const b = line.match(BOLD_TITLE)
  if (b) return b[1]
  const trimmed = line.trim()
  if (EMOJI_TITLE.test(trimmed) && trimmed.length <= 60 && !/[.!?]\s*$/.test(trimmed)) return trimmed
  return null
}

export function parseReview(markdown) {
  const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n')
  const sections = []
  let current = { rawTitle: '', body: [] }
  let inFence = false

  const push = () => {
    const body = current.body.join('\n').trim()
    if (!body && !current.rawTitle) return
    const title = cleanTitle(current.rawTitle)
    sections.push({
      title: title || (sections.length === 0 ? 'Overview' : 'Details'),
      severity: current.rawTitle ? classify(current.rawTitle) : 'info',
      body,
    })
  }

  for (const line of lines) {
    if (FENCE.test(line)) inFence = !inFence
    const t = !inFence && titleOf(line)
    if (t) {
      push()
      current = { rawTitle: t, body: [] }
    } else {
      current.body.push(line)
    }
  }
  push()

  // Drop title-only sections that only group the next heading (e.g. a "# Code Review" H1).
  return sections.filter((s, i) => s.body || i === sections.length - 1)
}

export function countBySeverity(sections) {
  return sections.reduce((acc, s) => {
    acc[s.severity] = (acc[s.severity] || 0) + 1
    return acc
  }, {})
}
