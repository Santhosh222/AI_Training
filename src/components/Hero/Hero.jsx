import "./Hero.scss";

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid" />
        <div className="hero__glow" />
      </div>

      <div className="hero__inner">
        <a href="#changelog" className="hero__pill">
          <span className="hero__pill-dot" aria-hidden="true" />
          <span className="hero__pill-label">New</span>
          <span className="hero__pill-text">Nova v2.0 — built for teams that ship</span>
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        <h1 className="hero__title">
          The operating system for{" "}
          <span className="hero__title-accent">modern product teams</span>
        </h1>

        <p className="hero__subtitle">
          Plan, build, and ship faster than ever. Nova brings issues, sprints, and
          docs into one elegant workspace designed for speed.
        </p>

        <div className="hero__actions">
          <a href="#start" className="btn btn--primary hero__cta">
            Start for free
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a href="#demo" className="btn btn--ghost hero__cta">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
              <path
                d="M5 3.5v9l7-4.5-7-4.5z"
                fill="currentColor"
              />
            </svg>
            Watch demo
          </a>
        </div>

        <div className="hero__meta">
          <span className="hero__meta-item">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
              <path
                d="M3 8l3 3 7-7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            No credit card required
          </span>
          <span className="hero__meta-divider" aria-hidden="true" />
          <span className="hero__meta-item">Free for 14 days</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
