import { useEffect, useState } from 'react'

const levels = ['All', 'A2', 'B1', 'B2', 'C1']
const statuses = [
  { id: 'all', label: 'All' },
  { id: 'learning', label: 'Learning' },
  { id: 'known', label: 'Known' },
]

const words = [
  { word: 'curious', level: 'A2', pos: 'adjective', say: 'KYOOR-ee-us', ar: 'فضولي', en: 'She is curious about everything.', arEx: 'هي فضولية تجاه كل شيء.' },
  { word: 'grateful', level: 'B1', pos: 'adjective', say: 'GRAYT-ful', ar: 'ممتن', en: "I'm grateful for your help.", arEx: 'أنا ممتن لمساعدتك.' },
  { word: 'achieve', level: 'B1', pos: 'verb', say: 'uh-CHEEV', ar: 'يحقق', en: 'You can achieve anything with practice.', arEx: 'يمكنك تحقيق أي شيء بالتدريب.' },
  { word: 'resilient', level: 'B2', pos: 'adjective', say: 'rih-ZIL-yunt', ar: 'مرن وقادر على التعافي', en: 'She stayed resilient after losing her job.', arEx: 'بقيت صامدة بعد أن خسرت وظيفتها.' },
  { word: 'reluctant', level: 'B2', pos: 'adjective', say: 'rih-LUK-tunt', ar: 'متردد، غير راغب', en: 'He was reluctant to speak in public.', arEx: 'كان متردداً في التحدث أمام الناس.' },
  { word: 'thrive', level: 'B2', pos: 'verb', say: 'THRYV', ar: 'يزدهر', en: 'Small businesses thrive when people trust them.', arEx: 'تزدهر المشاريع الصغيرة عندما يثق الناس بها.' },
  { word: 'elaborate', level: 'B2', pos: 'verb', say: 'ih-LAB-uh-rayt', ar: 'يشرح بالتفصيل', en: 'Could you elaborate on that point?', arEx: 'هل يمكنك التوسّع في هذه النقطة؟' },
  { word: 'ambiguous', level: 'C1', pos: 'adjective', say: 'am-BIG-yoo-us', ar: 'غامض، يحتمل أكثر من معنى', en: 'The instructions were ambiguous.', arEx: 'كانت التعليمات غامضة.' },
  { word: 'meticulous', level: 'C1', pos: 'adjective', say: 'muh-TIK-yuh-lus', ar: 'دقيق جداً', en: 'She is meticulous about her work.', arEx: 'إنها دقيقة جداً في عملها.' },
  { word: 'inevitable', level: 'C1', pos: 'adjective', say: 'in-EV-ih-tuh-bul', ar: 'حتمي', en: 'Change is inevitable.', arEx: 'التغيير حتمي.' },
]

const STORE = 'sayit-known-words'

function loadKnown() {
  try {
    const v = JSON.parse(localStorage.getItem(STORE))
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

function speak(text) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.85
  window.speechSynthesis.speak(u)
}

function SpeakIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  )
}

function Highlight({ text, word }) {
  const parts = text.split(new RegExp(`(${word})`, 'i'))
  return parts.map((p, i) =>
    p.toLowerCase() === word.toLowerCase() ? <mark key={i}>{p}</mark> : p
  )
}

export default function Vocabulary() {
  const [level, setLevel] = useState('All')
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')
  const [known, setKnown] = useState(loadKnown)

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(known))
    } catch {
      /* ignore */
    }
  }, [known])

  const toggle = (word) =>
    setKnown((k) => (k.includes(word) ? k.filter((x) => x !== word) : [...k, word]))

  const q = query.trim().toLowerCase()
  const list = words.filter((w) => {
    if (level !== 'All' && w.level !== level) return false
    if (status === 'known' && !known.includes(w.word)) return false
    if (status === 'learning' && known.includes(w.word)) return false
    if (q && !w.word.toLowerCase().includes(q) && !w.ar.includes(q)) return false
    return true
  })

  const pct = Math.round((known.length / words.length) * 100)

  return (
    <main className="page grid-bg">
      <header className="page-head fade-up">
        <div className="label">word by word</div>
        <h1 className="title-xl">Vocabulary</h1>
        <p className="ar-sub" dir="rtl">كلمات بنطق وأمثلة وترجمة. اسمعها، ثم اضغط «عرفتها» لتتبّع تقدمك.</p>
      </header>

      <div className="progress">
        <div className="progress-text">
          <span>{known.length} / {words.length} known</span>
          <span>{pct}%</span>
        </div>
        <div className="bar"><i style={{ width: `${pct}%` }} /></div>
      </div>

      <div className="controls">
        <input
          className="search"
          type="text"
          placeholder="Search a word or meaning... ابحث عن كلمة"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="filters">
          {levels.map((l) => (
            <button key={l} className={`chip-btn ${l === level ? 'on' : ''}`} onClick={() => setLevel(l)}>
              {l}
            </button>
          ))}
        </div>
        <div className="filters">
          {statuses.map((s) => (
            <button key={s.id} className={`chip-btn ${s.id === status ? 'on' : ''}`} onClick={() => setStatus(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <p className="empty">
          No words here yet.
          <span dir="rtl"> لا توجد كلمات مطابقة.</span>
        </p>
      ) : (
        <div className="word-grid">
          {list.map((w) => {
            const isKnown = known.includes(w.word)
            return (
              <article className={`word-card fade-up ${isKnown ? 'is-known' : ''}`} key={w.word}>
                <div className="word-top">
                  <span className="lvl">{w.level}</span>
                  <button className="speak" onClick={() => speak(w.word)} aria-label={`Listen to ${w.word}`}>
                    <SpeakIcon />
                  </button>
                </div>
                <h3>{w.word}</h3>
                <div className="say">{w.pos} · {w.say}</div>
                <div className="ar" dir="rtl">{w.ar}</div>
                <div className="ex">
                  <p><Highlight text={w.en} word={w.word} /></p>
                  <p className="ex-ar" dir="rtl">{w.arEx}</p>
                  <div className="ex-actions">
                    <button className="speak small" onClick={() => speak(w.en)}>
                      <SpeakIcon /> sentence
                    </button>
                    <button className={`known-btn ${isKnown ? 'on' : ''}`} onClick={() => toggle(w.word)} dir="rtl">
                      {isKnown ? '✓ عرفتها' : 'عرفتها؟'}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}