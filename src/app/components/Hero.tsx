import { motion } from "motion/react";
import { ArrowRight, CakeSlice, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { buildWhatsAppUrl, siteConfig } from "../config/site";

const heroCards = ["Tortas personalizadas", "Mesas dulces", "Pedidos especiales"];
const titleLines = ["Dulzura", "artesanal", "para", "momentos", "inolvidables"];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  const whatsappUrl = buildWhatsAppUrl(
    `Hola ${siteConfig.name}! Me gustaría cotizar una torta o mesa dulce personalizada.`
  );

  return (
    <section id="inicio" className="hero-showcase" aria-labelledby="hero-title">
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
            Pastelería artesanal
          </p>
          <h1 id="hero-title">
            {titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="hero-showcase__lead">
            Tortas, mesas dulces y detalles personalizados hechos con dedicación,
            estética y sabor.
          </p>
          <div className="hero-showcase__actions">
            <Button asChild className="btn-primary btn-large hero-showcase__primary">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" aria-hidden="true" />
                Cotizar por WhatsApp
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => scrollToSection("catalogo")}
              className="btn-secondary btn-large hero-showcase__secondary"
            >
              Ver catálogo
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="hero-vitrine"
          initial={{ opacity: 0, y: 22, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.78, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Vitrina de pastelería Casa Dolce"
        >
          <div className="hero-vitrine__frame">
            <img
              src="/instagram/post-02.webp"
              alt="Torta artesanal Casa Dolce con frutos rojos y crema"
              className="hero-vitrine__image"
              width="900"
              height="1200"
              decoding="async"
              fetchPriority="high"
            />
            <div className="hero-vitrine__caption">
              <span>Especialidad de la casa</span>
              <strong>Torta artesanal con frutos rojos</strong>
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
