import "./Features.scss";

const FEATURES = [
  {
    id: "speed",
    title: "Built for speed",
    description:
      "Keyboard-first workflows, instant navigation, and zero perceived latency. Every interaction is tuned to feel weightless.",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <path
          d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "collab",
    title: "Real-time collaboration",
    description:
      "Cursors, comments, and presence built-in. Your whole team stays in sync — no refreshes, no merge conflicts.",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M3 19c0-2.8 2.7-5 6-5s6 2.2 6 5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M14 17.5c.4-1.7 2.3-3 4.5-3s4 1.3 4.5 3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "automation",
    title: "Powerful automations",
    description:
      "Trigger workflows on any event with a visual builder and a typed API. Replace busywork with rules that just run.",
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
        <path
          d="M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="features__inner">
        <header className="features__header">
          <span className="features__eyebrow">Why Nova</span>
          <h2 className="features__title">
            Designed for the way modern teams build
          </h2>
          <p className="features__subtitle">
            Every detail is crafted to remove friction so you can focus on the
            work that matters.
          </p>
        </header>

        <ul className="features__grid">
          {FEATURES.map((feature) => (
            <li key={feature.id} className="feature-card">
              <span className="feature-card__icon">{feature.icon}</span>
              <h3 className="feature-card__title">{feature.title}</h3>
              <p className="feature-card__description">{feature.description}</p>
              <a href={`#feature-${feature.id}`} className="feature-card__link">
                Learn more
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Features;
