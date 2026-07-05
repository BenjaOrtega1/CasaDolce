import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, MessageCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { buildWhatsAppUrl, siteConfig } from "../config/site";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Catálogo", href: "#catalogo" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Galería", href: "#galeria" },
  { label: "Instagram", href: "#instagram" },
  { label: "Testimonios", href: "#testimonios" },
];

function scrollToSection(href: string) {
  const id = href.replace("#", "");
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappUrl = buildWhatsAppUrl(
    `Hola ${siteConfig.name}! Me gustaría solicitar una cotización.`
  );

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}
      >
        <div className="mx-auto flex h-[4.85rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[5.6rem] lg:px-8">
          <motion.button
            type="button"
            onClick={() => scrollToSection("#inicio")}
            className="brand-mark group"
            aria-label={`Ir al inicio de ${siteConfig.name}`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.48, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src="/logocasadolce.webp" alt="Casa Dolce" className="brand-logo brand-logo--header" />
            <span className="brand-mark__text" aria-hidden="true">
              <span>Casa Dolce</span>
              <small>Pastelería artesanal</small>
            </span>
          </motion.button>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => scrollToSection(link.href)}
                className="nav-pill"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button asChild className="btn-whatsapp hidden sm:inline-flex">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" aria-hidden="true" />
                WhatsApp
              </a>
            </Button>
            <Button
              type="button"
              onClick={() => scrollToSection("#cotizar")}
              className="btn-primary hidden sm:inline-flex"
            >
              Cotizar
            </Button>
            <button
              type="button"
              className="icon-button lg:hidden"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mobile-menu"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4" aria-label="Menú móvil">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => {
                    scrollToSection(link.href);
                    setMobileOpen(false);
                  }}
                  className="mobile-menu__link"
                >
                  {link.label}
                </button>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-3">
                <Button asChild className="btn-whatsapp">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-4" aria-hidden="true" />
                    WhatsApp
                  </a>
                </Button>
                <Button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    scrollToSection("#cotizar");
                    setMobileOpen(false);
                  }}
                >
                  Cotizar
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
