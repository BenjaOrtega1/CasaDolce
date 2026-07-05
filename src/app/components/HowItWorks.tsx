import { motion } from "motion/react";
import { Cake, CalendarHeart, ClipboardCheck, MessageCircleHeart } from "lucide-react";
import { buildWhatsAppUrl, siteConfig } from "../config/site";

const steps = [
  {
    icon: Cake,
    number: "01",
    title: "Inspírate",
    detail: "Catálogo",
    description:
      "Explora tortas, mesas dulces y terminaciones para encontrar el estilo que calza con tu celebración.",
  },
  {
    icon: MessageCircleHeart,
    number: "02",
    title: "Cuéntanos tu idea",
    detail: "WhatsApp",
    description:
      "Fecha, porciones, sabores, colores y cualquier referencia que quieras sumar.",
  },
  {
    icon: ClipboardCheck,
    number: "03",
    title: "Recibe tu cotización",
    detail: "Propuesta",
    description:
      "Preparamos una propuesta personalizada con alcance, tiempos y detalles del pedido.",
  },
  {
    icon: CalendarHeart,
    number: "04",
    title: "Coordinamos entrega",
    detail: "Agenda",
    description:
      "Acordamos retiro o despacho para que todo llegue en perfectas condiciones.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="section-shell section-shell--warm section-shell--process">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="section-heading"
        >
          <p className="section-kicker">Proceso simple</p>
          <h2>Cómo funciona</h2>
          <p>
            Una cotización clara, sin carrito ni pasos innecesarios. Tú nos cuentas la idea;
            Casa Dolce la convierte en una propuesta posible.
          </p>
        </motion.div>

        <div className="steps-grid" aria-label="Pasos para cotizar en Casa Dolce">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="step-card"
                style={{ minHeight: `${14 + i * 1.5}rem` }}
              >
                <span className="step-card__number" aria-hidden="true">
                  {step.number}
                </span>
                <div className="step-card__topline">
                  <span className="step-card__icon">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="step-card__detail">{step.detail}</span>
                </div>
                <div className="step-card__body">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                <span className="step-card__shine" aria-hidden="true" />
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="section-cta"
        >
          <p>¿Tienes una consulta rápida antes de cotizar?</p>
          <a
            href={buildWhatsAppUrl(`Hola ${siteConfig.name}! Tengo una consulta antes de cotizar.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold"
          >
            Escribir por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
