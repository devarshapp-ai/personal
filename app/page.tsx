"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";

export default function Home() {
  const portraitRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [portraitReady, setPortraitReady] = useState(false);
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  const goatCounterCode = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE;

  useEffect(() => {
    const portrait = portraitRef.current;
    if (!portrait) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      portrait.style.setProperty("--pointer-x", `${x * 14}px`);
      portrait.style.setProperty("--pointer-y", `${y * 10}px`);
    };

    const onScroll = () => {
      portrait.style.setProperty(
        "--scroll-y",
        `${Math.min(window.scrollY * 0.16, 82)}px`,
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
    if (!goatCounterCode) return;

    const script = document.createElement("script");
    script.src = "https://gc.zgo.at/count.js";
    script.async = true;
    script.dataset.goatcounter = `https://${goatCounterCode}.goatcounter.com/count`;
    script.addEventListener("load", () => {
      const analyticsWindow = window as typeof window & {
        goatcounter?: { visit_count?: (options: Record<string, unknown>) => void };
      };
      analyticsWindow.goatcounter?.visit_count?.({
        append: "#visitor-count",
        no_branding: true,
      });
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [goatCounterCode]);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!dot || !ring || !finePointer.matches) return;

    document.documentElement.classList.add("custom-cursor-active");

    const onPointerMove = (event: PointerEvent) => {
      const position = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      dot.style.transform = position;
      ring.style.transform = position;
      dot.classList.add("is-visible");
      ring.classList.add("is-visible");
    };
    const onPointerOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      ring.classList.toggle(
        "is-hovering",
        Boolean(target?.closest("a, button, input, textarea, label")),
      );
    };
    const onPointerDown = () => ring.classList.add("is-pressed");
    const onPointerUp = () => ring.classList.remove("is-pressed");
    const onPointerLeave = () => {
      dot.classList.remove("is-visible");
      ring.classList.remove("is-visible");
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);
    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("mouseleave", onPointerLeave);
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
          <div className="nav-links">
            <a href="#experience">Experience</a>
            <a href="#skills">Skills</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Application Engineer · Oracle India</p>
            <h1>
              I write Java,
              <br />
              solve problems, and <em>stay curious.</em>
            </h1>
            <p className="hero-intro">
              Hi, I&apos;m Devarsh—a Java developer with 3+ years of experience.
              I enjoy learning how things work, improving what I can, and having
              a full life beyond the screen.
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

          <div className="portrait-stage" ref={portraitRef}>
            <div className="orbit orbit-one" aria-hidden="true" />
            <div className="orbit orbit-two" aria-hidden="true" />
            <div className="portrait-frame">
              <Image
                className={portraitReady ? "portrait-image is-ready" : "portrait-image"}
                src={`${basePath}/devarsh-portrait.png`}
                alt="Devarsh Vasa"
                fill
                sizes="(max-width: 860px) 90vw, 34vw"
                unoptimized
                onLoad={() => setPortraitReady(true)}
                onError={() => setPortraitReady(false)}
              />
              <div
                className={portraitReady ? "portrait-placeholder is-hidden" : "portrait-placeholder"}
                role="img"
                aria-label="Portrait placeholder for Devarsh Vasa"
              >
                <span>DV</span>
                <small>Your portrait<br />drops in here</small>
              </div>
              <div className="portrait-shade" aria-hidden="true" />
            </div>
            <div className="portrait-note">Devarsh / Ahmedabad</div>
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
        <div className="section-label">
          <span>Selected impact</span>
          <span>Evidence from experience</span>
        </div>
        <div className="impact-grid">
          <article><strong>75%</strong><p>faster query response on datasets over 3 TB</p></article>
          <article><strong>30%</strong><p>faster data extraction after an agent upgrade</p></article>
          <article><strong>40%</strong><p>reduction in project size through refactoring</p></article>
          <article><strong>3+</strong><p>years learning and shipping software professionally</p></article>
        </div>
      </section>

      <section className="experience-section" id="experience">
        <div className="section-heading">
          <p>01 / Experience</p>
          <h2>Engineering reliable outcomes across enterprise systems.</h2>
        </div>
        <div className="career-trace">
          <article className="role is-current">
            <div className="role-meta"><span>2025 — Present</span><i>Current</i></div>
            <div className="role-copy">
              <p>Oracle India · Gandhinagar</p>
              <h3>Application Engineer</h3>
              <p className="role-summary">Working on Oracle Fusion SCM Purchasing—improving enterprise workflows, resolving high-severity customer issues, and partnering with global functional teams on robust fixes.</p>
              <ul>
                <li>Enhancement, defect resolution, and performance improvement</li>
                <li>Root-cause analysis across distributed procurement systems</li>
              </ul>
            </div>
          </article>

          <article className="role">
            <div className="role-meta"><span>2024 — 2025</span></div>
            <div className="role-copy">
              <p>Infor India · Ahmedabad</p>
              <h3>Software Engineer</h3>
              <p className="role-summary">Designed data-platform services and external REST APIs, built microservices and AWS workflows, and improved data extraction performance by 30%.</p>
              <ul>
                <li>HLD/LLD for REST APIs and data-processing modules</li>
                <li>AWS S3/EC2 delivery workflows with CI/CD</li>
              </ul>
            </div>
          </article>

          <article className="role">
            <div className="role-meta"><span>2022 — 2023</span></div>
            <div className="role-copy">
              <p>Argusoft · Gandhinagar</p>
              <h3>Programmer Analyst</h3>
              <p className="role-summary">Built secure digital-health integrations and optimized retrieval queries by 75% on datasets larger than 3 TB.</p>
              <ul>
                <li>RBAC, ABAC, JWT authorization, and REST integrations</li>
                <li>25% faster loading and a 40% smaller project footprint</li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section className="stack-section" id="skills" aria-labelledby="stack-title">
        <div className="stack-intro">
          <p>02 / Skills</p>
          <h2 id="stack-title">What I know.<br />What I&apos;m learning.</h2>
          <p className="stack-copy">Backend development is my strongest area. I keep the rest honest by showing the difference between tools I use confidently and areas where I&apos;m still building depth.</p>
        </div>
        <div className="stack-list">
          <div><span>Core backend · confident</span><p>Java · OOP · Spring · Spring Boot · REST APIs</p></div>
          <div><span>Data & performance · working knowledge</span><p>SQL · PostgreSQL · PL/SQL · Redis · caching</p></div>
          <div><span>Architecture · learning deeper</span><p>Microservices · system design · scalable services</p></div>
          <div><span>Delivery · hands-on</span><p>Docker · Git · GitHub · CI/CD · AWS S3 & EC2</p></div>
          <div><span>Frontend · basic familiarity</span><p>React · Angular · HTML · CSS</p></div>
          <div><span>AI-assisted work · fluent</span><p>Codex · Claude · prompting · agent workflows · fast iteration</p></div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-copy">
          <p>03 / Beyond the job title</p>
          <h2>Work matters.<br />It just isn&apos;t my whole personality.</h2>
        </div>
        <div className="about-details">
          <p>I&apos;m friendly, generally happy, and curious about more than software. I like fixing things, understanding why they work, and enjoying the process without turning everything into a productivity project.</p>
          <div className="interest-grid">
            <article><span>Move</span><strong>Strength training</strong><small>A good workout is the best reset.</small></article>
            <article><span>Sport</span><strong>Cricket & football</strong><small>I watch both, and still enjoy playing cricket.</small></article>
            <article><span>Think</span><strong>Maths & problem solving</strong><small>LeetCode, logical puzzles, and questions that take a few attempts.</small></article>
            <article><span>Follow</span><strong>Economics & current affairs</strong><small>I enjoy understanding the story behind the headline.</small></article>
            <article><span>Watch</span><strong>Movies & the MCU</strong><small>Iron Man remains the favourite—build, break, improve.</small></article>
          </div>
          <p className="education-note">BE in Computer Engineering · LDRP ITR · Ahmedabad</p>
        </div>
      </section>

      <section className="premium-section" id="contact">
        <div className="premium-terminal">
          <div className="terminal-bar"><span>● ● ●</span><p>devarsh@portfolio — premium</p><b>⌘K</b></div>
          <div className="terminal-content" aria-live="polite">
            <p><span>devarsh@portfolio</span>:~$ unlock --premium</p>
            {!premiumUnlocked ? (
              <>
                <h2>Unlock the premium version of Devarsh.</h2>
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
        <div className="contact-panel">
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
        {goatCounterCode ? <p id="visitor-count">Visitors: </p> : <p>Designed for good connections.</p>}
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
