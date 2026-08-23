"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

const memes = [
  {
    src: "/memes/rk-meme.jpg",
    title: "The codefix cycle",
    description: "A little developer humour about one code fix inviting the next bug fix.",
    alt: "Black-and-white developer meme created by Devarsh Vasa about code fixes and follow-up bug fixes",
    width: 1151,
    height: 1367,
  },
  {
    src: "/memes/bug-vs-feature-hd.png",
    title: "Bug or feature?",
    description: "When a small bug fix somehow becomes a feature-sized solution.",
    alt: "Cartoon developer meme contrasting a leaking pipe labelled Bug with an elaborate fountain labelled Feature",
    width: 1115,
    height: 1411,
  },
  {
    src: "/memes/youtube-premium-hd.png",
    title: "YouTube Premium economics",
    description: "Advertising logic meets one very practical budget question.",
    alt: "Meme asking why YouTube shows expensive advertisements to someone who cannot afford YouTube Premium",
    width: 1268,
    height: 1241,
  },
  {
    src: "/memes/resume-lightbulb-hd.png",
    title: "Résumé translation",
    description: "The professional way to say you changed a light bulb.",
    alt: "Meme humorously rewriting changing a light bulb as a professional résumé achievement",
    width: 1194,
    height: 1317,
  },
] as const;

const sourceEasterEgg = `

╔══════════════════════════════════════════════════════════════╗
║                    WELL, HELLO THERE.                        ║
╠══════════════════════════════════════════════════════════════╣
║ You opened DevTools. Bold move.                              ║
║                                                              ║
║ Looking for secrets? Plot twist: they are not committed.     ║
║ Found a bug? Congratulations, you are now part of QA.        ║
║ Found clean code? Please tell my future self.                ║
║                                                              ║
║ Recruiter? This absolutely counts as attention to detail.    ║
║ Copying the site? At least improve the commit message.       ║
║                                                              ║
║                                      Regards,                ║
║                                      Devarsh Vasa            ║
╚══════════════════════════════════════════════════════════════╝
`;

export default function Home() {
  const heroArtRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [visitorCount, setVisitorCount] = useState<string | null>(null);
  const [activeMemeIndex, setActiveMemeIndex] = useState<number | null>(null);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  const goatCounterCode = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE;

  useEffect(() => {
    const comment = document.createComment(sourceEasterEgg);
    document.body.prepend(comment);
    return () => comment.remove();
  }, []);

  useEffect(() => {
    const heroArt = heroArtRef.current;
    if (!heroArt) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      heroArt.style.setProperty("--pointer-x", `${x * 24}px`);
      heroArt.style.setProperty("--pointer-y", `${y * 16}px`);
      heroArt.style.setProperty("--tilt-x", `${y * -7}deg`);
      heroArt.style.setProperty("--tilt-y", `${x * 9}deg`);
    };

    const onScroll = () => {
      heroArt.style.setProperty(
        "--scroll-y",
        `${Math.max(window.scrollY * -0.1, -56)}px`,
      );
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (activeMemeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveMemeIndex(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMemeIndex]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".scroll-reveal"));
    if (reduceMotion.matches) return;

    document.documentElement.classList.add("scroll-motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.13, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => {
      document.documentElement.classList.remove("scroll-motion-ready");
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const numbers = Array.from(document.querySelectorAll<HTMLElement>(".impact-number[data-target]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animationFrames = new Set<number>();

    if (reduceMotion.matches) {
      numbers.forEach((number) => {
        number.textContent = `${number.dataset.target}%`;
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const number = entry.target as HTMLElement;
          const target = Number(number.dataset.target ?? 0);
          const startedAt = performance.now();
          const duration = 900;

          const count = (now: number) => {
            const progress = Math.min((now - startedAt) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            number.textContent = `${Math.round(target * eased)}%`;
            if (progress < 1) animationFrames.add(window.requestAnimationFrame(count));
          };

          number.textContent = "0%";
          animationFrames.add(window.requestAnimationFrame(count));
          observer.unobserve(number);
        });
      },
      { threshold: 0.55 },
    );

    numbers.forEach((number) => observer.observe(number));
    return () => {
      observer.disconnect();
      animationFrames.forEach((frame) => window.cancelAnimationFrame(frame));
    };
  }, []);

  useEffect(() => {
    if (!goatCounterCode || !/^[a-z0-9-]+$/.test(goatCounterCode)) return;

    const origin = `https://${goatCounterCode}.goatcounter.com`;
    const controller = new AbortController();

    const fetchVisitorCount = () => {
      fetch(
        `${origin}/counter/TOTAL.json?start=2026-08-21`,
        {
          signal: controller.signal,
          referrerPolicy: "no-referrer",
          cache: "no-store",
        },
      )
        .then((response) => (response.ok ? response.json() : null))
        .then((data: { count?: string } | null) => {
          if (typeof data?.count === "string") setVisitorCount(data.count);
        })
        .catch(() => undefined);
    };

    const pixel = new window.Image();
    pixel.referrerPolicy = "no-referrer";
    pixel.onload = fetchVisitorCount;
    pixel.onerror = fetchVisitorCount;
    pixel.src = `${origin}/count?p=${encodeURIComponent(window.location.pathname)}&t=${encodeURIComponent(document.title)}&rnd=${Date.now()}`;

    const fallbackTimer = window.setTimeout(fetchVisitorCount, 1500);
    const refreshTimer = window.setInterval(fetchVisitorCount, 15 * 60 * 1000);

    return () => {
      window.clearTimeout(fallbackTimer);
      window.clearInterval(refreshTimer);
      pixel.onload = null;
      pixel.onerror = null;
      controller.abort();
    };
  }, [goatCounterCode]);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!dot || !ring || !finePointer.matches) return;

    let animationFrame = 0;
    let pointerX = -100;
    let pointerY = -100;
    let pointerTarget: Element | null = null;
    let pointerIsInside = false;

    const hideCursor = () => {
      pointerIsInside = false;
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      document.documentElement.classList.remove("custom-cursor-active");
      dot.classList.remove("is-visible", "is-on-accent");
      ring.classList.remove("is-visible", "is-on-accent", "is-hovering", "is-pressed");
    };

    const renderCursor = () => {
      animationFrame = 0;
      if (!pointerIsInside) return;

      const position = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;
      const target = pointerTarget ?? document.elementFromPoint(pointerX, pointerY);
      const isOnAccent = Boolean(target?.closest(".contact-panel"));

      dot.style.transform = position;
      ring.style.transform = position;
      dot.classList.toggle("is-on-accent", isOnAccent);
      ring.classList.toggle("is-on-accent", isOnAccent);
      ring.classList.toggle(
        "is-hovering",
        Boolean(target?.closest("a, button, input, textarea, label")),
      );
      dot.classList.add("is-visible");
      ring.classList.add("is-visible");
      document.documentElement.classList.add("custom-cursor-active");
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        hideCursor();
        return;
      }

      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerTarget = event.target instanceof Element ? event.target : null;
      pointerIsInside =
        pointerX >= 0 &&
        pointerY >= 0 &&
        pointerX <= window.innerWidth &&
        pointerY <= window.innerHeight;

      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(renderCursor);
      }
    };
    const onPointerDown = () => ring.classList.add("is-pressed");
    const onPointerUp = () => ring.classList.remove("is-pressed");
    const onPointerOut = (event: PointerEvent) => {
      const leftViewport =
        event.clientX <= 0 ||
        event.clientY <= 0 ||
        event.clientX >= window.innerWidth ||
        event.clientY >= window.innerHeight;
      if (event.relatedTarget === null && leftViewport) hideCursor();
    };
    const onVisibilityChange = () => {
      if (document.hidden) hideCursor();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("pointercancel", hideCursor, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", hideCursor);
    return () => {
      hideCursor();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", hideCursor);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", hideCursor);
    };
  }, []);

  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Portfolio message from ${name || "a visitor"}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:devarsh.jobs@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <main>
      <div className="cursor-dot" ref={cursorDotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={cursorRingRef} aria-hidden="true" />
      <section className="hero" id="top">
        <nav className="site-nav" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Devarsh Vasa, home">
            DV<span>.</span>
          </a>
          <div className="nav-actions">
            <div className="nav-links">
              <a href="#experience">Experience</a>
              <a href="#skills">Skills</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="social-links" aria-label="Social profiles">
              <a href="https://www.linkedin.com/in/devarsh-vasa/" target="_blank" rel="noreferrer" aria-label="Devarsh Vasa on LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.3H3.2V21h3.3V8.3ZM4.8 3A1.9 1.9 0 1 0 4.8 6.8 1.9 1.9 0 0 0 4.8 3ZM21 13.7c0-3.8-2-5.6-4.7-5.6-2.2 0-3.1 1.2-3.7 2V8.3H9.3V21h3.3v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2.1 1.9 2.1 3.4V21H21v-7.3Z" /></svg>
              </a>
            </div>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Application Engineer · Oracle India</p>
            <p className="hero-hello">Hi, I&apos;m Devarsh Vasa.</p>
            <h1>
              I write Java,
              <br />
              solve problems, and <em>stay curious.</em>
            </h1>
            <p className="hero-intro">
              I&apos;m a Java developer with 3+ years of experience. I enjoy learning
              how things work, improving what I can, and having a full life beyond
              the screen.
            </p>
            <div className="hero-actions">
              <a className="primary-link" href="#experience">
                See where I&apos;ve worked <span>↗</span>
              </a>
              <a className="text-link" href="mailto:devarsh.jobs@gmail.com">
                Start a conversation
              </a>
            </div>
          </div>

          <div className="hero-art" ref={heroArtRef}>
            {/* Static export: the transparent WebP is pre-compressed and loaded eagerly for the hero. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hero-portrait"
              src={`${basePath}/devarsh-midnight.webp`}
              alt="Devarsh Vasa"
              width="941"
              height="1672"
              decoding="async"
              fetchPriority="high"
            />
            <div className="trace-card" aria-hidden="true">
              <span>request</span>
              <strong>200 OK</strong>
              <i />
            </div>
          </div>
        </div>

        <div className="hero-footer">
          <span>Java · Spring Boot · PostgreSQL</span>
          <a href="#experience">Scroll to trace the journey ↓</a>
          <span>Ahmedabad, India</span>
        </div>
      </section>

      <section className="impact-section" aria-label="Selected impact">
        <div className="section-label scroll-reveal">
          <span>Selected impact</span>
          <span>Evidence from experience</span>
        </div>
        <div className="impact-grid">
          <article className="scroll-reveal"><strong className="impact-number" data-target="75">75%</strong><span className="impact-meter" aria-hidden="true"><i className="meter-75" /></span><p>faster query response on datasets over 3 TB</p></article>
          <article className="scroll-reveal"><strong className="impact-number" data-target="30">30%</strong><span className="impact-meter" aria-hidden="true"><i className="meter-30" /></span><p>faster data extraction after an agent upgrade</p></article>
          <article className="scroll-reveal"><strong className="impact-number" data-target="40">40%</strong><span className="impact-meter" aria-hidden="true"><i className="meter-40" /></span><p>reduction in project size through refactoring</p></article>
          <article className="scroll-reveal"><strong>3+</strong><p>years learning and shipping software professionally</p></article>
        </div>
      </section>

      <section className="experience-section" id="experience">
        <div className="section-heading scroll-reveal">
          <p>01 / Experience</p>
          <h2>Engineering reliable outcomes across enterprise systems.</h2>
        </div>
        <div className="career-trace">
          <article className="role is-current scroll-reveal">
            <div className="role-meta"><span>2025 — Present</span><i>Current</i></div>
            <div className="role-copy">
              <p className="company-line"><span className="company-mark oracle-mark">Oracle</span><span>Oracle India · Gandhinagar</span></p>
              <h3>Application Engineer</h3>
              <p className="role-summary">Working in Oracle Fusion SCM Procurement, with a focus on Purchasing—improving enterprise workflows, resolving high-severity customer issues, and partnering with global functional teams on robust fixes.</p>
              <ul>
                <li>Enhancement, defect resolution, and performance improvement</li>
                <li>Root-cause analysis across distributed procurement systems</li>
              </ul>
            </div>
          </article>

          <article className="role scroll-reveal">
            <div className="role-meta"><span>2024 — 2025</span></div>
            <div className="role-copy">
              <p className="company-line"><span className="company-mark infor-mark">infor</span><span>Infor India · Ahmedabad</span></p>
              <h3>Software Engineer</h3>
              <p className="role-summary">Designed data-platform services and external REST APIs, built microservices and AWS workflows, and improved data extraction performance by 30%.</p>
              <ul>
                <li>HLD/LLD for REST APIs and data-processing modules</li>
                <li>AWS S3/EC2 delivery workflows with CI/CD</li>
              </ul>
            </div>
          </article>

          <article className="role scroll-reveal">
            <div className="role-meta"><span>2022 — 2023</span></div>
            <div className="role-copy">
              <p className="company-line">
                <a className="company-logo-link" href="https://www.medplat.co.in/" target="_blank" rel="noreferrer" aria-label="Visit the MEDplat website">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="company-logo medplat-logo" src={`${basePath}/medplat-logo.png`} alt="Argusoft MEDplat" width="685" height="206" loading="lazy" />
                </a>
                <span>Argusoft · MEDplat · Gandhinagar</span>
              </p>
              <h3>Programmer Analyst</h3>
              <p className="role-summary">Worked on MEDplat, an interoperable digital-health platform for community healthcare, building secure integrations and improving retrieval performance by 75% on datasets larger than 3 TB.</p>
              <ul>
                <li>RBAC, ABAC, JWT authorization, and REST integrations</li>
                <li>25% faster loading and a 40% smaller project footprint</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section className="stack-section" id="skills" aria-labelledby="stack-title">
        <div className="stack-intro scroll-reveal">
          <p>02 / Skills</p>
          <h2 id="stack-title">What I know.<br />What I&apos;m learning.</h2>
          <p className="stack-copy">Backend development is my strongest area. I keep the rest honest by showing the difference between tools I use confidently and areas where I&apos;m still building depth.</p>
        </div>
        <div className="stack-list">
          <div className="scroll-reveal"><span>Core backend · confident</span><p>Java · OOP · Spring · Spring Boot · REST APIs</p></div>
          <div className="scroll-reveal"><span>Data & performance · working knowledge</span><p>SQL · PostgreSQL · PL/SQL · Redis · caching</p></div>
          <div className="scroll-reveal"><span>Architecture · learning deeper</span><p>Microservices · system design · scalable services</p></div>
          <div className="scroll-reveal"><span>Delivery · hands-on</span><p>Docker · Git · GitHub · CI/CD · AWS S3 & EC2</p></div>
          <div className="scroll-reveal"><span>Frontend · basic familiarity</span><p>React · Angular · HTML · CSS</p></div>
          <div className="scroll-reveal"><span>AI-assisted work · fluent</span><p>Codex · Claude · Prompting · Agent Workflows · Fast Iteration</p></div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-copy scroll-reveal">
          <p>03 / Beyond the job title</p>
          <h2>Work matters.<br />It just isn&apos;t my whole personality.</h2>
        </div>
        <div className="about-details scroll-reveal">
          <p>I&apos;m friendly, generally happy, and curious about more than software. I like fixing things, understanding why they work, and enjoying the process without turning everything into a productivity project.</p>
          <div className="interest-grid">
            <article className="meme-interest scroll-reveal">
              <button type="button" onClick={() => setActiveMemeIndex(0)} aria-haspopup="dialog">
                <span>Create</span>
                <strong>Memes</strong>
                <small>I enjoy making tech and pop-culture memes. Open the archive ↗</small>
              </button>
            </article>
            <article className="scroll-reveal"><span>Sport</span><strong>Cricket & Formula 1</strong><small>I enjoy playing cricket and following F1.</small></article>
            <article className="scroll-reveal"><span>Think</span><strong>Maths & problem solving</strong><small>LeetCode, logical puzzles, and questions that take a few attempts.</small></article>
            <article className="scroll-reveal"><span>Follow</span><strong>Economics & current affairs</strong><small>I enjoy understanding the story behind the headline.</small></article>
            <article className="scroll-reveal"><span>Watch</span><strong>Movies & the MCU</strong><small>Iron Man remains the favourite—build, break, improve.</small></article>
            <article className="scroll-reveal"><span>Culture</span><strong>Garba</strong><small>Good music, a lively circle, and Garba season.</small></article>
          </div>
        </div>
      </section>

      <section className="premium-section" id="contact">
        <div className="premium-terminal scroll-reveal">
          <div className="terminal-bar"><span>● ● ●</span><p>devarsh@portfolio — premium</p><b>⌘K</b></div>
          <div className="terminal-content" aria-live="polite">
            <p><span>devarsh@portfolio</span>:~$ unlock --premium</p>
            {!premiumUnlocked ? (
              <>
                <h2>Unlock the premium version of Devarsh Vasa.</h2>
                <p className="terminal-muted">One tiny requirement: hire him.</p>
                <button type="button" onClick={() => setPremiumUnlocked(true)}>Attempt unlock ↵</button>
              </>
            ) : (
              <div className="unlocked-message">
                <p className="success">ACCESS GRANTED ✓</p>
                <h2>Just kidding. The work is always in progress.</h2>
                <p className="terminal-muted">But the conversation can start right now.</p>
              </div>
            )}
          </div>
        </div>
        <div className="contact-panel scroll-reveal">
          <p>04 / Say hello</p>
          <h2>Got a role, an idea, or just a good conversation?</h2>
          <form
            className="contact-form"
            action={formspreeId ? `https://formspree.io/f/${formspreeId}` : undefined}
            method={formspreeId ? "POST" : undefined}
            onSubmit={formspreeId ? undefined : handleContactSubmit}
          >
            <div className="form-field">
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" name="name" type="text" autoComplete="name" required />
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="form-field message-field">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows={4} required />
            </div>
            <button type="submit">{formspreeId ? "Send message ↗" : "Open email draft ↗"}</button>
          </form>
          <p className="form-note">{formspreeId ? "Your message will be delivered securely through the form service." : "This static-site form opens your email app with the message filled in—nothing is stored."}</p>
          <div className="contact-links">
            <a href="mailto:devarsh.jobs@gmail.com">devarsh.jobs@gmail.com ↗</a>
            <a href="https://www.linkedin.com/in/devarsh-vasa/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <a className="brand" href="#top">DV<span>.</span></a>
        <p>
          <span aria-live="polite">
            {visitorCount
              ? `${visitorCount} ${visitorCount === "1" ? "visit" : "visits"} so far`
              : "Visits updating"}
          </span>
          {" · © 2026 Devarsh Vasa"}
        </p>
        <a href="#top">Back to top ↑</a>
      </footer>

      {activeMemeIndex !== null && (
        <div
          className="meme-lightbox"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveMemeIndex(null);
          }}
        >
          <section className="meme-dialog" role="dialog" aria-modal="true" aria-labelledby="meme-dialog-title">
            <header>
              <div>
                <span>Meme archive · {String(activeMemeIndex + 1).padStart(2, "0")} / {String(memes.length).padStart(2, "0")}</span>
                <h2 id="meme-dialog-title">{memes[activeMemeIndex].title}</h2>
              </div>
              <button className="meme-close" type="button" onClick={() => setActiveMemeIndex(null)} aria-label="Close meme gallery">Close ×</button>
            </header>
            <figure>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${basePath}${memes[activeMemeIndex].src}`}
                alt={memes[activeMemeIndex].alt}
                width={memes[activeMemeIndex].width}
                height={memes[activeMemeIndex].height}
                decoding="async"
              />
              <figcaption>{memes[activeMemeIndex].description}</figcaption>
            </figure>
            {memes.length > 1 && (
              <nav aria-label="Meme gallery navigation">
                <button type="button" onClick={() => setActiveMemeIndex((activeMemeIndex - 1 + memes.length) % memes.length)}>← Previous</button>
                <button type="button" onClick={() => setActiveMemeIndex((activeMemeIndex + 1) % memes.length)}>Next →</button>
              </nav>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
