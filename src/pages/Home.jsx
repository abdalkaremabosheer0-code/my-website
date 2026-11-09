import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const words = ['Vocabulary', 'Reading', 'Listening', 'Writing', 'Grammar', 'Speaking']
const loop = [...words, ...words, ...words]

const slogans = ['No boring', 'No stress', 'Just English', 'Say it right']
const sloganLoop = [...slogans, ...slogans, ...slogans, ...slogans]

const cards = [
  { num: '01', title: 'Vocabulary', text: 'Words with sound, examples and real context. Learn less, remember more.', r: '-2deg', pose: 'pose-cards' },
  { num: '02', title: 'Reading', text: 'Short stories where new words live. Tap any word to hear it and see it.', r: '1.5deg', pose: 'pose-reading' },
  { num: '03', title: 'Listening', text: 'Hear it, say it, repeat it. Shadow native speakers line by line.', r: '-1deg', pose: 'pose-listening' },
  { num: '04', title: 'Writing', text: 'Build sentences that flow. Learn connectors, fix mistakes, sound natural.', r: '2deg', pose: 'pose-writing' },
]

const steps = [
  { num: '01', title: 'Learn it', text: 'Meet new words and rules in a clear, bite-sized way.', art: 'step-learn', r: '-3deg' },
  { num: '02', title: 'Use it', text: 'Practice in sentences, stories and real situations.', art: 'step-use', r: '2deg' },
  { num: '03', title: 'Own it', text: 'Test yourself until it sticks and feels natural.', art: 'step-own', r: '-2deg' },
]

// قطع الهيرو: l/t/w بنسبة من المسرح، fx/fy نقطة بداية الطيران
const heroPieces = [
 { n: 'hero-guy', l: '20%', t: '42%', w: '36%', r: '0deg', fx: '0', fy: '70vh', d: 0.2, depth: 20, z: 3, spin: '0deg' },
  { n: 'bubble-ohyeah', l: '6%', t: '3%', w: '16%', r: '-8deg', fx: '-60vw', fy: '-20vh', d: 0.3, depth: 22 },
  { n: 'bubble-sayit-yellow', l: '43%', t: '-3%', w: '12.5%', r: '6deg', fx: '0', fy: '-60vh', d: 0.4, depth: -26 },
  { n: 'megaphone-a', l: '87%', t: '20%', w: '11%', r: '12deg', fx: '60vw', fy: '-10vh', d: 0.5, depth: 30 },
  { n: 'label-sayit', l: '1%', t: '60%', w: '15%', r: '-10deg', fx: '-60vw', fy: '20vh', d: 0.6, depth: -20 },
  { n: 'megaphone-b', l: '5%', t: '76%', w: '13%', r: '10deg', fx: '-60vw', fy: '40vh', d: 0.7, depth: 28 },
  { n: 'label-gowild', l: '18%', t: '80%', w: '14%', r: '5deg', fx: '0', fy: '60vh', d: 0.8, depth: -18 },
  { n: 'chat-heart', l: '62%', t: '80%', w: '8%', r: '-8deg', fx: '30vw', fy: '60vh', d: 0.9, depth: 24 },
  { n: 'badge-fun', l: '80%', t: '74%', w: '15%', r: '-7deg', fx: '60vw', fy: '40vh', d: 1.0, depth: -22 },
  { n: 'star-pink-2', l: '90%', t: '3%', w: '3.5%', r: '10deg', fx: '40vw', fy: '-40vh', d: 1.1, depth: -40 },
  { n: 'spark-yellow-1', l: '40%', t: '8%', w: '3%', r: '0deg', fx: '-20vw', fy: '-40vh', d: 1.15, depth: 36 },
  { n: 'zigzag-1', l: '1%', t: '38%', w: '4%', r: '-8deg', fx: '-40vw', fy: '0', d: 1.2, depth: 30 },
  { n: 'zigzag-3', l: '72%', t: '68%', w: '7%', r: '6deg', fx: '40vw', fy: '30vh', d: 1.25, depth: -30 },
  { n: 'spark-pink-1', l: '33%', t: '80%', w: '3.5%', r: '0deg', fx: '-10vw', fy: '50vh', d: 1.3, depth: 32 },
  { n: 'star-yellow-1', l: '93%', t: '56%', w: '3.5%', r: '14deg', fx: '40vw', fy: '10vh', d: 1.35, depth: -34 },
  { n: 'star-pink-1', l: '13%', t: '44%', w: '3%', r: '-10deg', fx: '-40vw', fy: '10vh', d: 1.4, depth: 38 },
  { n: 'spark-yellow-2', l: '47%', t: '90%', w: '3%', r: '0deg', fx: '10vw', fy: '50vh', d: 1.45, depth: -28 },
]

function Letters({ text }) {
  return text.split('').map((ch, i) => (
    <span className="ch" key={i} style={{ '--i': i }}>
      {ch}
    </span>
  ))
}

function Piece({ n, l, t, w, r = '0deg', fx = '0', fy = '0', d = 0, depth = 0, z = 4, spin }) {
  const style = { '--r': r, '--fx': fx, '--fy': fy, '--delay': `${d}s` }
  if (spin) style['--spin'] = spin
  return (
    <div className="px" style={{ left: l, top: t, width: w, '--d': depth, zIndex: z }}>
      <img className="fly" src={`/images/${n}.png`} alt="" draggable="false" style={style} />
    </div>
  )
}

function Word({ text, l, t, size, r, cls, depth }) {
  return (
    <div className="px" style={{ left: l, top: t, '--d': depth, zIndex: 2 }}>
      <span className={`word ${cls}`} style={{ '--r': r, fontSize: size }} aria-hidden="true">
        <Letters text={text} />
      </span>
    </div>
  )
}

function TiltCard({ children, r }) {
  const ref = useRef(null)

  const move = (e) => {
    const el = ref.current
    if (!el) return
    const b = el.getBoundingClientRect()
    const px = (e.clientX - b.left) / b.width
    const py = (e.clientY - b.top) / b.height
    el.style.setProperty('--ry', `${(px - 0.5) * 14}deg`)
    el.style.setProperty('--rx', `${(0.5 - py) * 14}deg`)
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
  }

  const leave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div ref={ref} className="note-card" style={{ '--r': r }} onMouseMove={move} onMouseLeave={leave}>
      {children}
    </div>
  )
}

export default function Home() {
  const heroRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    // ظهور العناصر + طيران القطع عند الوصول إليها
    // (نراقب الأب لأن القطعة تبدأ خارج الشاشة)
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const t = e.target
          if (t.classList.contains('reveal')) t.classList.add('in')
          Array.from(t.children).forEach((c) => {
            if (c.classList.contains('fly')) {
              c.classList.add('in')
              c.addEventListener('transitionend', (ev) => {
                if (ev.propertyName === 'transform') c.classList.add('done')
              })
            }
          })
          io.unobserve(t)
        }),
      { threshold: 0.15 }
    )
    const targets = new Set()
    document.querySelectorAll('.reveal').forEach((el) => targets.add(el))
    document.querySelectorAll('.fly').forEach((el) => el.parentElement && targets.add(el.parentElement))
    targets.forEach((el) => io.observe(el))

    // ضوء + parallax في قسم البداية
    const hero = heroRef.current
    let raf = 0
    const onHeroMove = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect()
        const x = e.clientX - r.left
        const y = e.clientY - r.top
        hero.style.setProperty('--sx', `${x}px`)
        hero.style.setProperty('--sy', `${y}px`)
        hero.style.setProperty('--mx', ((x / r.width) - 0.5) * 2)
        hero.style.setProperty('--my', ((y / r.height) - 0.5) * 2)
      })
    }
    hero.addEventListener('mousemove', onHeroMove)

    // شريط تقدم التمرير
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      const p = max > 0 ? h.scrollTop / max : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      hero.removeEventListener('mousemove', onHeroMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      <div className="scroll-bar" ref={barRef} />

      <section className="hero grid-bg" id="top" ref={heroRef}>
        <div className="spot" />
        <h1 className="sr-only">Talk out loud! Learn English</h1>

        <div className="stage">
          <Word text="TALK" l="1%" t="16%" size="18.5cqw" r="-6deg" cls="yellow" depth={14} />
          <Word text="OUT" l="53%" t="4%" size="17.5cqw" r="4deg" cls="pinkw" depth={-12} />
          <Word text="LOUD!" l="49%" t="38%" size="15.5cqw" r="-4deg" cls="pinkw" depth={10} />

          {heroPieces.map((p) => (
            <Piece key={p.n} {...p} />
          ))}
        </div>

        <div className="actions fade-up">
          <Link className="btn btn-pink btn-big" to="/app">Start Talking! →</Link>
          <Link className="btn btn-yellow" to="/app">Play Word Game</Link>
        </div>
      </section>

      <div className="marquee">
        <div className="track">
          {[0, 1].map((g) =>
            loop.map((w, i) => (
              <span key={`${g}-${i}`}>{w} ✦</span>
            ))
          )}
        </div>
      </div>

      <section className="paper" id="start">
        <div className="inner">
          <div className="title-wrap">
            <h2 className="title reveal">
              Pick your <em>move.</em>
            </h2>
            <Piece n="underline-yellow" l="55%" t="88%" w="17%" r="-2deg" fx="-30vw" fy="0" d={0.3} />
            <Piece n="arrow-loop" l="80%" t="4%" w="8%" r="10deg" fx="40vw" fy="-20vh" d={0.5} />
            <Piece n="burst-pink" l="10%" t="-8%" w="9%" r="-12deg" fx="-40vw" fy="-10vh" d={0.4} />
          </div>

          <div className="cards">
            {cards.map((c, i) => (
              <div className="reveal" key={c.num} style={{ '--delay': `${i * 0.12}s` }}>
                <TiltCard r={c.r}>
                  <img
                    className="pose fly"
                    src={`/images/${c.pose}.png`}
                    alt=""
                    draggable="false"
                    style={{ '--r': '5deg', '--fx': '30px', '--fy': '-40px', '--spin': '0deg', '--delay': `${0.2 + i * 0.12}s` }}
                  />
                  <div className="num">{c.num}</div>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dark grid-bg" id="how">
        <h2 className="title reveal">
          Simple. <em>Fast.</em> Yours.
        </h2>
        <div className="steps">
          {steps.map((s, i) => (
            <div className="step reveal" key={s.num} style={{ '--delay': `${i * 0.12}s` }}>
              <div className="step-art">
                <img
                  className="fly"
                  src={`/images/${s.art}.png`}
                  alt=""
                  draggable="false"
                  style={{ '--r': s.r, '--fx': '0', '--fy': '40px', '--spin': '0deg', '--delay': `${0.15 + i * 0.15}s` }}
                />
              </div>
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>

        <div className="marquee pink rev">
          <div className="track">
            {[0, 1].map((g) =>
              sloganLoop.map((w, i) => (
                <span key={`${g}-${i}`}>{w} ✦</span>
              ))
            )}
          </div>
        </div>

        <div className="cta-block reveal">
          <Piece n="pose-wave" l="3%" t="10%" w="19%" r="-4deg" fx="-60vw" fy="10vh" d={0.1} spin="0deg" />
          <Piece n="pose-thumbs" l="78%" t="8%" w="19%" r="4deg" fx="60vw" fy="10vh" d={0.25} spin="0deg" />
          <h2 className="brush" aria-label="Ready?">
            <Letters text="READY?" />
          </h2>
          <div className="actions">
            <Link className="btn btn-pink btn-big" to="/app">Start Talking! →</Link>
          </div>
        </div>

        <footer className="footer">
          <span className="logo">sayit.</span>
          <span>© 2026 · Learn English your way</span>
        </footer>
      </section>
    </>
  )
}