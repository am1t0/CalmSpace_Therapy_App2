import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FirebaseContext } from "../context/FirebaseContext";
import { PAGES } from "../utils/constants";
import meditationImage from "../assets/medidate.png";

const BREATH_DURATION_MS = 60000;
const WHY_CALMSPACE_ITEMS = [
  {
    icon: "heart",
    title: "A softer daily check-in",
    text: "Reflect, breathe, and notice how you feel without pressure.",
  },
  {
    icon: "chat",
    title: "Calm support when you need",
    text: "Move from the landing page into CalmBot for a quiet conversation.",
  },
  {
    icon: "chart",
    title: "Your progress in one place",
    text: "Journal entries, goals, and mood patterns stay easy to revisit.",
  },
  {
    icon: "spark",
    title: "Designed to feel light",
    text: "Simple actions, and fewer distractions keep the space peaceful.",
  },
];

export default function LandingScreen({ setCurrentPage }) {
  const { user } = useContext(FirebaseContext);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const animationRef = useRef(null);
  const startedAtRef = useRef(0);
  const pausedElapsedRef = useRef(0);

  const name = useMemo(() => {
    if (!user || user.isAnonymous) return "Member";
    if (user.displayName) return user.displayName.split(" ")[0];
    if (user.email) return user.email.split("@")[0];
    return "Member";
  }, [user]);

  const progressColor = useMemo(() => {
    const hue =
      progress < 0.5 ? 130 - progress * 150 : 55 - (progress - 0.5) * 110;

    return `hsl(${hue}, 84%, 46%)`;
  }, [progress]);

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  useEffect(() => {
    if (!isRunning) return undefined;

    const step = (now) => {
      const elapsed = now - startedAtRef.current;
      const nextProgress = Math.min(elapsed / BREATH_DURATION_MS, 1);

      setProgress(nextProgress);

      if (nextProgress >= 1) {
        pausedElapsedRef.current = BREATH_DURATION_MS;
        setIsRunning(false);
        animationRef.current = null;
        return;
      }

      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return stopAnimation;
  }, [isRunning]);

  useEffect(() => stopAnimation, []);

  const handleStart = () => {
    const savedElapsed =
      progress >= 1
        ? 0
        : pausedElapsedRef.current || progress * BREATH_DURATION_MS;
    pausedElapsedRef.current = savedElapsed;
    startedAtRef.current = performance.now() - savedElapsed;
    setProgress(savedElapsed / BREATH_DURATION_MS);
    setIsRunning(true);
  };

  const handlePause = () => {
    if (!isRunning) return;

    const elapsed = Math.min(
      performance.now() - startedAtRef.current,
      BREATH_DURATION_MS,
    );
    pausedElapsedRef.current = elapsed;
    setProgress(elapsed / BREATH_DURATION_MS);
    setIsRunning(false);
    stopAnimation();
  };

  const handleEnd = () => {
    pausedElapsedRef.current = 0;
    setProgress(0);
    setIsRunning(false);
    stopAnimation();
  };

  return (
    <section className="landing-screen">
      <div className="landing-layout">
        <div className="landing-copy">
          <p className="landing-eyebrow">CalmSpace</p>
          <h1>
            Welcome back, <span>{name}</span>
          </h1>
          <p className="landing-subtitle">Talk to your peace.</p>
          <button
            type="button"
            className="landing-chat-button"
            onClick={() => setCurrentPage?.(PAGES.CHAT)}
          >
            Chat with CalmBot
          </button>
        </div>

        <div className="landing-breath-card">
          <p className="landing-breath-title">Take a pose and breathe</p>

          <div
            className="landing-meditation-wrap"
            aria-label="Breathing progress"
          >
            <div className="landing-motion-field" aria-hidden="true">
              <span className="landing-wave landing-wave--one" />
              <span className="landing-wave landing-wave--two" />
              <span className="landing-wave landing-wave--three" />
              <span className="landing-leaf landing-leaf--one" />
              <span className="landing-leaf landing-leaf--two" />
              <span className="landing-leaf landing-leaf--three" />
            </div>

            <svg
              className="landing-breath-arc"
              viewBox="0 0 420 360"
              aria-hidden="true"
            >
              <path
                className="landing-breath-arc__track"
                d="M42 312 C48 34 372 34 378 312"
                pathLength="100"
              />
              <path
                className="landing-breath-arc__progress"
                d="M42 312 C48 34 372 34 378 312"
                pathLength="100"
                stroke={progressColor}
                strokeDasharray="100"
                strokeDashoffset={100 - progress * 100}
              />
            </svg>

            <div className="landing-person-image">
              <img
                src={meditationImage}
                alt="Person meditating in a seated pose"
              />
            </div>
          </div>

          <div className="landing-breath-actions">
            <button type="button" onClick={handleStart} disabled={isRunning}>
              Start
            </button>
            <button type="button" onClick={handlePause} disabled={!isRunning}>
              Pause
            </button>
            <button type="button" onClick={handleEnd}>
              End
            </button>
          </div>
        </div>
      </div>

      <WhyCalmSpace />
    </section>
  );
}

function WhyCalmSpace() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();

      // when user scrolls deeper into section
      if (rect.top*1.4 < window.innerHeight) {
        setExpand(true);
      }
      else 
        setExpand(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`landing-why${isVisible ? " landing-why--visible" : ""}`}
      aria-labelledby="why-calmspace-title"
    >
      <div className="landing-why__header">
        <h2>Why CalmSpace</h2>
      </div>

      <div className="landing-why__grid">
        {WHY_CALMSPACE_ITEMS.map((item, index) => (
          <div
            className={`landing-why__card ${
              expand ? "landing-why__card--expand" : ""
            }`}
            key={item.title}
            style={{ "--delay": `${index * 110}ms` }}
          >
            <article className="landing-why__item">
              <span
                className={`landing-why__icon landing-why__icon--${item.icon}`}
              >
                <BenefitIcon type={item.icon} />
              </span>
              <h4>{item.title}</h4>
            </article>

            {/* NEW description box */}
            <div className="landing-why__desc" id={`${item.icon}-desc`}>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BenefitIcon({ type }) {
  switch (type) {
    case "heart":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 14a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v7Z" />
          <path d="M8 9h8" />
          <path d="M8 13h5" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="m7 15 3-4 4 3 5-7" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z" />
          <path d="M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
        </svg>
      );
    default:
      return null;
  }
}
