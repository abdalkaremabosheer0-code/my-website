import { useEffect, useRef, useState } from 'react'
import './Shadowing.css'

const TAGS = [
  { id: 'all', label: 'All' },
  { id: 'everyday', label: 'Everyday' },
  { id: 'connected', label: 'Connected speech' },
  { id: 'keep', label: 'Keep talking' },
]

// stress: الأحرف الكبيرة = المقاطع المنبورة (الأقوى)
const sentences = [
  {
    id: 1, tag: 'everyday', text: "How's it going?", ar: 'كيف الحال؟',
    stress: "HOW'S it GO-ing",
    note: 'في الكلام السريع تُنطق قريبة من «هاوزِت غوينغ». كلمتا How’s it مربوطتان.',
  },
  {
    id: 2, tag: 'everyday', text: 'Nice to meet you.', ar: 'تشرفت بمعرفتك.',
    stress: 'NICE to MEET you',
    note: 'meet you تُنطق قريبة من «ميتشو»: حرف t مع y يعطيان صوت ch.',
  },
  {
    id: 3, tag: 'connected', text: "I'm gonna grab a coffee.", ar: 'رح آخذ قهوة.',
    stress: "I'm GON-na GRAB a COF-fee",
    note: 'gonna هي going to مختصرة. وكلمتا grab a تُربطان فتصيران قريبتين من «غرابا».',
  },
  {
    id: 4, tag: 'connected', text: 'What do you want to do?', ar: 'شو بدك تعمل؟',
    stress: 'WHAT do you WANT to DO',
    note: 'الكلمات الصغيرة (do, you, to) تُنطق ضعيفة وسريعة. في الكلام السريع: «وَدَيا وانا دو».',
  },
  {
    id: 5, tag: 'connected', text: 'Can I get a glass of water?', ar: 'ممكن كاس ماي؟',
    stress: 'can I GET a GLASS of WA-ter',
    note: 'حرف t بين حرفين متحركين يُنطق قريباً من d خفيفة (flap T): get a «غيدا»، water «وادر».',
  },
  {
    id: 6, tag: 'keep', text: 'Let me think about it.', ar: 'خليني أفكر فيها.',
    stress: 'let me THINK a-BOUT it',
    note: 'عبارة إنقاذ ممتازة: تشتري بها وقتاً وأنت تفكر بدل أن تصمت. let me تصير «ليمي».',
  },
  {
    id: 7, tag: 'keep', text: "What I mean is that I'm still learning.", ar: 'ما أقصده أنني ما زلت أتعلم.',
    stress: "what I MEAN is that I'm still LEARN-ing",
    note: 'إذا لم تجد الكلمة، قل What I mean is ثم أكمل بكلمات أبسط. المهم أن تستمر.',
  },
  {
    id: 8, tag: 'keep', text: "That's a great question.", ar: 'هذا سؤال ممتاز.',
    stress: "that's a GREAT ques-tion",
    note: 'تعطيك ثواني تفكر فيها. المقطع الأخير في question يُنطق قريباً من «تْشن».',
  },
  {
    id: 9, tag: 'keep', text: "I'm not sure, but I think so.", ar: 'لست متأكداً لكن أعتقد ذلك.',
    stress: "I'm not SURE but I THINK so",
    note: 'حتى لو لم تكن متأكداً، أكمل الجملة. التردد المهذب أفضل من الصمت.',
  },
  {
    id: 10, tag: 'connected', text: 'Could you say that again, please?', ar: 'ممكن تعيد ذلك لو سمحت؟',
    stress: 'could you SAY that a-GAIN please',
    note: 'could you تندمج وتصير قريبة من «كُدْيا». طلب الإعادة ليس عيباً، بل مهارة.',
  },
  {
    id: 11, tag: 'connected', text: 'I want to be able to speak without stopping.', ar: 'بدي أقدر أحكي بدون ما أتوقف.',
    stress: 'I WANT to be A-ble to SPEAK with-OUT STOP-ping',
    note: 'want to تصير wanna في الكلام السريع. وكلمتا able to تُربطان.',
  },
  {
    id: 12, tag: 'everyday', text: "I'd like to practice my English.", ar: 'بدي أتمرن على إنجليزيتي.',
    stress: "I'd LIKE to PRAC-tice my ENG-lish",
    note: 'الراء الأمريكية: اللسان يتراجع للخلف دون أن يلمس سقف الفم ودون أن يرتجف كالراء العربية.',
  },
]

const STORE_STATS = 'sayit-speaking-stats'
const STORE_VOICE = 'sayit-voice'

function loadStats() {
  try {
    const v = JSON.parse(localStorage.getItem(STORE_STATS))
    if (v && typeof v === 'object') return { sec: Number(v.sec) || 0, tries: v.tries || {} }
  } catch {
    /* ignore */
  }
  return { sec: 0, tries: {} }
}

const ALIASES = [
  [/\bgonna\b/g, 'going to'],
  [/\bwanna\b/g, 'want to'],
  [/\bgotta\b/g, 'got to'],
  [/\bkinda\b/g, 'kind of'],
  [/\blemme\b/g, 'let me'],
]

function norm(s) {
  let t = s.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z' ]/g, ' ')
  ALIASES.forEach(([re, v]) => {
    t = t.replace(re, v)
  })
  return t.split(/\s+/).filter(Boolean)
}

function checkSaid(target, said) {
  const got = norm(said)
  let pos = 0
  const words = target.split(' ').map((raw) => {
    const parts = norm(raw)
    let ok = true
    parts.forEach((p) => {
      const i = got.indexOf(p, pos)
      if (i === -1) ok = false
      else pos = i + 1
    })
    return { raw, ok }
  })
  const good = words.filter((w) => w.ok).length
  return { words, percent: Math.round((good / words.length) * 100) }
}

function pickVoice(pool, savedName) {
  const saved = pool.find((v) => v.name === savedName)
  if (saved) return saved
  const prefs = ['Natural', 'Aria', 'Jenny', 'Guy', 'Google US English', 'Samantha', 'Zira', 'David']
  for (const p of prefs) {
    const v = pool.find((x) => x.name.includes(p))
    if (v) return v
  }
  return pool[0] || null
}

function speakText(text, { rate = 0.95, voice, onend } = {}) {
  if (!('speechSynthesis' in window)) {
    if (onend) onend()
    return
  }
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = rate
  if (voice) u.voice = voice
  u.onend = () => onend && onend()
  u.onerror = (e) => {
    if (e.error !== 'interrupted' && e.error !== 'canceled' && onend) onend()
  }
  window.speechSynthesis.speak(u)
}

function noticeText(code) {
  switch (code) {
    case 'mic-blocked':
      return 'المايك مغلق. اضغط على رمز القفل بجانب الرابط وفعّل الميكروفون، ثم جرّب.'
    case 'no-speech':
      return 'ما سمعت شيئاً. اقترب من المايك وجرّب مرة ثانية.'
    case 'network':
      return 'التعرّف على الكلام يحتاج إنترنت.'
    case 'sr-unsupported':
      return 'هذه الميزة تعمل في Chrome وEdge فقط.'
    case 'rec-unsupported':
      return 'متصفحك لا يدعم التسجيل. جرّب Chrome أو Edge.'
    case 'short':
      return 'التسجيل قصير جداً. اضغط وتكلم ثم أوقف.'
    default:
      return code ? 'حصل خطأ. جرّب مرة ثانية.' : ''
  }
}

function Icon({ name }) {
  const common = {
    viewBox: '0 0 24 24', width: 18, height: 18, fill: 'none', stroke: 'currentColor',
    strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true',
  }
  if (name === 'play') return <svg {...common}><path d="M7 5v14l12-7z" fill="currentColor" /></svg>
  if (name === 'mic') return <svg {...common}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" /></svg>
  if (name === 'stop') return <svg {...common}><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" /></svg>
  if (name === 'swap') return <svg {...common}><path d="M7 7h11l-3-3" /><path d="M17 17H6l3 3" /></svg>
  return null
}

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = Math.round(sec % 60)
  return `${m}m ${s}s`
}

export default function Shadowing() {
  const [tag, setTag] = useState('all')
  const [idx, setIdx] = useState(0)
  const [voices, setVoices] = useState([])
  const [voiceName, setVoiceName] = useState(() => {
    try {
      return localStorage.getItem(STORE_VOICE) || ''
    } catch {
      return ''
    }
  })
  const [playing, setPlaying] = useState('')
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [mine, setMine] = useState('')
  const [listening, setListening] = useState(false)
  const [result, setResult] = useState(null)
  const [notice, setNotice] = useState('')
  const [stats, setStats] = useState(loadStats)

  const mrRef = useRef(null)
  const streamRef = useRef(null)
  const chunksRef = useRef([])
  const startRef = useRef(0)
  const timerRef = useRef(0)
  const mineRef = useRef('')
  const audioRef = useRef(null)
  const recogRef = useRef(null)
  const discardRef = useRef(false)

  const list = tag === 'all' ? sentences : sentences.filter((s) => s.tag === tag)
  const current = list[Math.min(idx, list.length - 1)]

  const en = voices.filter((v) => /^en/i.test(v.lang))
  const us = en.filter((v) => /^en[-_]US/i.test(v.lang))
  const pool = us.length ? us : en
  const voice = pickVoice(pool, voiceName)

  // تحميل الأصوات (تصل متأخرة في بعض المتصفحات)
  useEffect(() => {
    if (!('speechSynthesis' in window)) return undefined
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.onvoiceschanged = load
    return () => {
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  // حفظ الإحصائيات
  useEffect(() => {
    try {
      localStorage.setItem(STORE_STATS, JSON.stringify(stats))
    } catch {
      /* ignore */
    }
  }, [stats])

  // تنظيف عند مغادرة الصفحة
  useEffect(() => {
    return () => {
      discardRef.current = true
      if (mrRef.current && mrRef.current.state !== 'inactive') mrRef.current.stop()
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
      clearInterval(timerRef.current)
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      if (audioRef.current) audioRef.current.pause()
      if (recogRef.current) recogRef.current.abort()
      if (mineRef.current) URL.revokeObjectURL(mineRef.current)
    }
  }, [])

  const stopRec = () => {
    clearInterval(timerRef.current)
    if (mrRef.current && mrRef.current.state !== 'inactive') mrRef.current.stop()
    setRecording(false)
  }

  const stopAll = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    if (audioRef.current) audioRef.current.pause()
    if (recogRef.current) recogRef.current.abort()
    if (mrRef.current && mrRef.current.state !== 'inactive') {
      discardRef.current = true
      stopRec()
    }
    setPlaying('')
    setListening(false)
  }

  const resetAttempt = () => {
    if (mineRef.current) URL.revokeObjectURL(mineRef.current)
    mineRef.current = ''
    setMine('')
    setResult(null)
    setNotice('')
  }

  const choose = (i) => {
    stopAll()
    resetAttempt()
    setIdx(i)
  }

  const changeTag = (t) => {
    stopAll()
    resetAttempt()
    setTag(t)
    setIdx(0)
  }

  const listen = (mode) => {
    stopAll()
    setPlaying(mode)
    speakText(current.text, {
      rate: mode === 'slow' ? 0.7 : 0.95,
      voice,
      onend: () => setPlaying(''),
    })
  }

  const startRec = async () => {
    stopAll()
    setNotice('')
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      setNotice('rec-unsupported')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mr = new MediaRecorder(stream)
      const sid = current.id
      chunksRef.current = []
      discardRef.current = false
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size) chunksRef.current.push(e.data)
      }
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        if (discardRef.current) return
        const dur = (Date.now() - startRef.current) / 1000
        if (dur < 0.6) {
          setNotice('short')
          return
        }
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' })
        if (mineRef.current) URL.revokeObjectURL(mineRef.current)
        const url = URL.createObjectURL(blob)
        mineRef.current = url
        setMine(url)
        setResult(null)
        setStats((s) => ({
          sec: s.sec + dur,
          tries: { ...s.tries, [sid]: (s.tries[sid] || 0) + 1 },
        }))
      }
      mrRef.current = mr
      startRef.current = Date.now()
      setElapsed(0)
      mr.start()
      setRecording(true)
      timerRef.current = setInterval(() => {
        const e = (Date.now() - startRef.current) / 1000
        setElapsed(e)
        if (e >= 20) stopRec()
      }, 200)
    } catch {
      setNotice('mic-blocked')
    }
  }

  const playMine = () => {
    if (!mine) return
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    if (audioRef.current) audioRef.current.pause()
    const a = new Audio(mine)
    audioRef.current = a
    a.play()
  }

  const compareAB = () => {
    if (!mine) return
    stopAll()
    setPlaying('ab')
    speakText(current.text, {
      rate: 0.95,
      voice,
      onend: () => {
        setPlaying('')
        playMine()
      },
    })
  }

  const startCheck = () => {
    stopAll()
    setNotice('')
    setResult(null)
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setNotice('sr-unsupported')
      return
    }
    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.continuous = false
    let heard = ''
    let failed = false
    rec.onresult = (e) => {
      heard = Array.from(e.results).map((r) => r[0].transcript).join(' ')
    }
    rec.onerror = (e) => {
      failed = true
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') setNotice('mic-blocked')
      else if (e.error === 'no-speech') setNotice('no-speech')
      else if (e.error === 'network') setNotice('network')
      else if (e.error !== 'aborted') setNotice('error')
    }
    rec.onend = () => {
      setListening(false)
      if (heard) setResult({ ...checkSaid(current.text, heard), heard })
      else if (!failed) setNotice('no-speech')
    }
    recogRef.current = rec
    try {
      rec.start()
      setListening(true)
    } catch {
      setNotice('error')
    }
  }

  const stopCheck = () => {
    if (recogRef.current) recogRef.current.stop()
  }

  const onVoice = (e) => {
    setVoiceName(e.target.value)
    try {
      localStorage.setItem(STORE_VOICE, e.target.value)
    } catch {
      /* ignore */
    }
  }

  const practiced = Object.keys(stats.tries).length
  const cur = list.findIndex((s) => s.id === current.id)

  let verdict = ''
  if (result) {
    if (result.percent >= 90) verdict = 'Clean! Now say it again, a bit faster.'
    else if (result.percent >= 60) verdict = 'Close! Listen once more and go again.'
    else verdict = 'No stress. Slow it down and try again.'
  }

  return (
    <main className="page grid-bg">
      <header className="page-head fade-up">
        <div className="label">listen. say. repeat.</div>
        <h1 className="title-xl">Shadowing</h1>
        <p className="ar-sub" dir="rtl">اسمع الجملة، كرّرها بصوتك، وقارن. الهدف أن تحكي بثقة ودون توقف.</p>
      </header>

      <div className="sh-stats">
        <span className="sh-stat">Spoken: <b>{formatTime(stats.sec)}</b></span>
        <span className="sh-stat">Practiced: <b>{practiced} / {sentences.length}</b></span>
      </div>

      <div className="sh-voice">
        <label htmlFor="voice">Voice</label>
        <select id="voice" value={voice ? voice.name : ''} onChange={onVoice}>
          {pool.length === 0 && <option value="">Default voice</option>}
          {pool.map((v) => (
            <option key={v.name} value={v.name}>{v.name}</option>
          ))}
        </select>
      </div>

      <div className="filters">
        {TAGS.map((t) => (
          <button key={t.id} className={`chip-btn ${t.id === tag ? 'on' : ''}`} onClick={() => changeTag(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="sh-layout">
        <div className="sh-list">
          {list.map((s, i) => (
            <button key={s.id} className={`sh-item ${i === cur ? 'on' : ''}`} onClick={() => choose(i)}>
              <span>{s.text}</span>
              {stats.tries[s.id] ? <span className="done">✓</span> : <small>{s.tag}</small>}
            </button>
          ))}
        </div>

        <section className="sh-stage">
          <div className="sh-text">
            {result
              ? result.words.map((w, i) => (
                  <span key={i} className={`w ${w.ok ? 'ok' : 'miss'}`}>{w.raw}</span>
                ))
              : current.text}
          </div>
          <div className="sh-stress">{current.stress}</div>
          <div className="sh-ar" dir="rtl">{current.ar}</div>
          <div className="sh-note" dir="rtl">{current.note}</div>

          <div className="sh-steps">
            <div className="sh-step">
              <span className="sh-n">1</span>
              <span className="sh-label">Listen</span>
              <button className="sh-btn" onClick={() => listen('slow')} disabled={playing === 'slow'}>
                <Icon name="play" /> Slow
              </button>
              <button className="sh-btn" onClick={() => listen('normal')} disabled={playing === 'normal'}>
                <Icon name="play" /> Normal
              </button>
            </div>

            <div className="sh-step">
              <span className="sh-n">2</span>
              <span className="sh-label">Say it</span>
              {recording ? (
                <button className="sh-btn rec" onClick={stopRec}>
                  <Icon name="stop" /> Stop · {elapsed.toFixed(1)}s
                </button>
              ) : (
                <button className="sh-btn pink" onClick={startRec}>
                  <Icon name="mic" /> Record
                </button>
              )}
            </div>

            <div className="sh-step">
              <span className="sh-n">3</span>
              <span className="sh-label">Compare</span>
              <button className="sh-btn" onClick={playMine} disabled={!mine}>
                <Icon name="play" /> Mine
              </button>
              <button className="sh-btn" onClick={compareAB} disabled={!mine || playing === 'ab'}>
                <Icon name="swap" /> Model, then mine
              </button>
            </div>

            <div className="sh-step">
              <span className="sh-n">4</span>
              <span className="sh-label">Check</span>
              {listening ? (
                <button className="sh-btn rec" onClick={stopCheck}>
                  <Icon name="stop" /> Listening… stop
                </button>
              ) : (
                <button className="sh-btn" onClick={startCheck}>
                  <Icon name="mic" /> Did it understand me?
                </button>
              )}
            </div>
          </div>

          {notice && <p className="sh-notice" dir="rtl">{noticeText(notice)}</p>}

          {result && (
            <div className="sh-result">
              <div className="sh-percent">{result.percent}%</div>
              <div>
                <p className="sh-verdict">{verdict}</p>
                <p className="sh-heard">It heard: “{result.heard}”</p>
              </div>
            </div>
          )}

          <div className="sh-nav">
            <button className="sh-btn" onClick={() => choose(Math.max(0, cur - 1))} disabled={cur <= 0}>← Prev</button>
            <button className="sh-btn" onClick={() => choose(Math.min(list.length - 1, cur + 1))} disabled={cur >= list.length - 1}>Next →</button>
          </div>

          <p className="sh-tip" dir="rtl">
            زر «Check» يخبرك هل فُهمت كلماتك، لكنه لا يحكم على لهجتك. الحكم الأهم هو أذنك: قارن صوتك بالنموذج.
          </p>
        </section>
      </div>
    </main>
  )
}
