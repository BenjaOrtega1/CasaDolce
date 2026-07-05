import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CakeSlice, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { buildWhatsAppUrl } from "../config/site";
import { defaultHeroSettings, type HeroSettings } from "../config/hero";

const heroCards = ["Tortas personalizadas", "Mesas dulces", "Pedidos especiales"];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  const [settings, setSettings] = useState<HeroSettings>(defaultHeroSettings);
  const heroRef = useRef<HTMLElement | null>(null);
  const autoScrollingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);
  const titleLines = useMemo(() => settings.title.split("\n").map((line) => line.trim()).filter(Boolean), [settings.title]);
  const whatsappUrl = buildWhatsAppUrl(settings.whatsappMessage);

  useEffect(() => {
    let mounted = true;

    import("../services/catalog")
      .then(({ getPublicHeroSettings }) => getPublicHeroSettings())
      .then((nextSettings) => {
        if (mounted) setSettings(nextSettings);
      })
      .catch(() => {
        if (mounted) setSettings(defaultHeroSettings);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const scrollToCatalog = () => {
      if (autoScrollingRef.current) return;
      const catalog = document.getElementById("catalogo");
      if (!catalog) return;

      autoScrollingRef.current = true;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      catalog.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

      window.setTimeout(() => {
        autoScrollingRef.current = false;
      }, reduceMotion ? 120 : 950);
    };

    const canAutoScroll = () => {
      const rect = hero.getBoundingClientRect();
      return rect.top <= 12 && rect.bottom > window.innerHeight * 0.32;
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY <= 8 || !canAutoScroll()) return;
      event.preventDefault();
      scrollToCatalog();
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const startY = touchStartYRef.current;
      const currentY = event.touches[0]?.clientY;
      if (startY === null || currentY === undefined) return;

      const swipingDownPage = startY - currentY > 18;
      if (!swipingDownPage || !canAutoScroll()) return;

      event.preventDefault();
      touchStartYRef.current = null;
      scrollToCatalog();
    };

    hero.addEventListener("wheel", handleWheel, { passive: false });
    hero.addEventListener("touchstart", handleTouchStart, { passive: true });
    hero.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      hero.removeEventListener("wheel", handleWheel);
      hero.removeEventListener("touchstart", handleTouchStart);
      hero.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <section ref={heroRef} id="inicio" className="hero-showcase" aria-labelledby="hero-title">
      <div className="hero-showcase__texture" aria-hidden="true" />
      <div className="hero-showcase__inner">
        <motion.div
          className="hero-showcase__copy"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="hero-showcase__badge">
            <CakeSlice className="size-4" aria-hidden="true" />
            {settings.badge}
          </p>
          <h1 id="hero-title">
            {titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="hero-showcase__lead">{settings.lead}</p>
          <div className="hero-showcase__actions">
            <Button asChild className="btn-primary btn-large hero-showcase__primary">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" aria-hidden="true" />
                {settings.primaryCtaLabel}
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => scrollToSection("catalogo")}
              className="btn-secondary btn-large hero-showcase__secondary"
            >
              {settings.secondaryCtaLabel}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="hero-vitrine"
          initial={{ opacity: 0, y: 22, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.78, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Vitrina de pasteleria Casa Dolce"
        >
          <div className="hero-vitrine__frame">
            <img
              src={settings.image}
              alt={settings.imageAlt}
              className="hero-vitrine__image"
              width="900"
              height="1200"
              decoding="async"
              fetchPriority="high"
            />
            <div className="hero-vitrine__caption">
              <span>{settings.captionLabel}</span>
              <strong>{settings.captionTitle}</strong>
            </div>
          </div>

          <div className="hero-vitrine__seal" aria-hidden="true">
            <img src="/logocasadolce-icon.webp" alt="" />
          </div>

          <div className="hero-vitrine__cards" aria-hidden="true">
            {heroCards.map((card, index) => (
              <motion.span
                key={card}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.34 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {card}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
