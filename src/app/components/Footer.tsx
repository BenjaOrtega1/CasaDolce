import { Clock, Facebook, Heart, Instagram, MapPin, Phone } from "lucide-react";
import { buildWhatsAppUrl, siteConfig } from "../config/site";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Footer() {
  const quickMessage = `Hola ${siteConfig.name}! Me gustaría hacer una consulta.`;

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          <div>
            <div className="brand-mark brand-mark--footer">
              <img src="/logocasadolce.webp" alt="Casa Dolce" className="brand-logo brand-logo--footer" />
            </div>
            <p className="footer__copy">
              En Casa Dolce creemos que cada celebración merece una creación única. Elaboramos tortas y mesas dulces artesanales que combinan diseño, sabor y dedicación para hacer de cada ocasión un recuerdo inolvidable.
            </p>
            <div className="footer__social">
              <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram de Casa Dolce">
                <Instagram className="size-4" aria-hidden="true" />
              </a>
              <a href={siteConfig.social.facebook} aria-label="Facebook de Casa Dolce">
                <Facebook className="size-4" aria-hidden="true" />
              </a>
              <a
                href={buildWhatsAppUrl(quickMessage)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de Casa Dolce"
              >
                <Phone className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h4>Navegación</h4>
            <ul>
              {[
                { label: "Inicio", id: "inicio" },
                { label: "Catálogo", id: "catalogo" },
                { label: "Cómo funciona", id: "como-funciona" },
                { label: "Galería", id: "galeria" },
                { label: "Instagram", id: "instagram" },
                { label: "Cotizar", id: "cotizar" },
              ].map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => scrollToSection(item.id)}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Contacto</h4>
            <ul>
              <li>
                <MapPin className="size-4" aria-hidden="true" />
                <span>{siteConfig.location}</span>
              </li>
              <li>
                <Phone className="size-4" aria-hidden="true" />
                <a href={buildWhatsAppUrl(quickMessage)} target="_blank" rel="noopener noreferrer">
                  {siteConfig.whatsappDisplay}
                </a>
              </li>
              <li>
                <span className="footer__mail-icon">@</span>
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Horarios</h4>
            <ul>
              {[
                { day: "Lunes a viernes", hours: "9:00 - 19:00" },
                { day: "Sábado", hours: "9:00 - 16:00" },
                { day: "Domingo", hours: "Cerrado" },
              ].map((item) => (
                <li key={item.day}>
                  <Clock className="size-4" aria-hidden="true" />
                  <span>
                    <strong>{item.day}:</strong> {item.hours}
                  </span>
                </li>
              ))}
            </ul>
            <p className="footer__notice">
              Pedidos urgentes: consúltanos por WhatsApp con al menos 48 horas de anticipación.
            </p>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 {siteConfig.name}. Todos los derechos reservados.</p>
          <p>
            Hecho con <Heart className="size-3 fill-current" aria-hidden="true" /> para celebraciones memorables
          </p>
        </div>
      </div>
    </footer>
  );
}
