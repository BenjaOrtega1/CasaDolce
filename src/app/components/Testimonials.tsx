import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import type { CustomerReview } from "../services/catalog";
import { testimonials } from "./data/products";

const fallbackReviews: CustomerReview[] = testimonials.map((testimonial) => ({
  id: Number(testimonial.id),
  name: testimonial.name,
  event: testimonial.event,
  text: testimonial.text,
  rating: testimonial.rating,
  image: "",
  alt: `Reseña de ${testimonial.name} para Casa Dolce`,
}));

export function Testimonials() {
  const [reviews, setReviews] = useState<CustomerReview[]>(fallbackReviews);

  useEffect(() => {
    let mounted = true;

    import("../services/catalog").then(({ getPublicReviews }) => getPublicReviews()).then((remoteReviews) => {
      if (!mounted || !remoteReviews.length) return;
      const localFill = fallbackReviews.filter(
        (review) => !remoteReviews.some((remoteReview) => remoteReview.id === review.id),
      );
      setReviews([...remoteReviews, ...localFill].slice(0, 6));
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="testimonios" className="section-shell section-shell--ink">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 22, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="section-heading section-heading--dark"
        >
          <p className="section-kicker">
            <Star className="size-4" aria-hidden="true" />
            Clientes felices
          </p>
          <h2>Historias que vuelven</h2>
          <p>
            La mejor vitrina de Casa Dolce es una mesa llena de invitados preguntando
            quién hizo la torta.
          </p>
        </motion.div>

        <div className="testimonial-grid">
          {reviews.map((testimonial, i) => (
            <motion.article
              key={`${testimonial.id}-${testimonial.name}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.58, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="testimonial-card"
            >
              <Quote className="testimonial-card__quote size-12 opacity-40" aria-hidden="true" />
              {testimonial.image ? (
                <img
                  src={testimonial.image}
                  alt={testimonial.alt || `Foto de reseña enviada por ${testimonial.name}`}
                  loading="lazy"
                  className="testimonial-card__image"
                />
              ) : null}
              <div className="flex gap-1" aria-label={`${testimonial.rating} estrellas`}>
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star key={index} className="size-4 fill-current text-[var(--gold)]" aria-hidden="true" />
                ))}
              </div>
              <p>"{testimonial.text}"</p>
              <footer>
                <span className="testimonial-card__avatar">
                  {testimonial.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <span>
                  <strong>{testimonial.name}</strong>
                  <small>{testimonial.event}</small>
                </span>
              </footer>
            </motion.article>
          ))}
        </div>

        <div className="trust-row" aria-label="Atributos de servicio">
          {["Ingredientes naturales", "Empaque premium", "Cotización personalizada", "Coordinación por WhatsApp"].map(
            (item, idx) => (
              <span 
                key={item} 
                className={idx === 0 ? "border-[rgba(199,154,47,0.32)] border rounded-full px-3 py-1" : ""}
              >
                {item}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
