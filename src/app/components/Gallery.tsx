import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import type { GalleryImage } from "../services/catalog";

export function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeImage = images[activeIndex] ?? images[0];
  const marqueeImages = useMemo(() => [...images, ...images], [images]);

  useEffect(() => {
    let mounted = true;

    import("../services/catalog")
      .then((module) => module.getPublicGalleryImages())
      .then((items) => {
        if (!mounted) return;
        setImages(items);
        setActiveIndex(0);
      })
      .catch(() => {
        if (mounted) setImages([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (reduceMotion || images.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, [images.length, reduceMotion]);

  function goTo(index: number) {
    setActiveIndex((index + images.length) % images.length);
  }

  function handleImageError(index: number) {
    setImages((current) => {
      const sourceIndex = index % current.length;
      const nextImages = current.filter((_, itemIndex) => itemIndex !== sourceIndex);
      setActiveIndex((currentIndex) => Math.min(currentIndex, Math.max(0, nextImages.length - 1)));
      return nextImages;
    });
  }

  if (!activeImage) return null;

  return (
    <section id="galeria" className="section-shell section-shell--gallery">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="section-heading"
        >
          <p className="section-kicker">
            <Images className="size-4" aria-hidden="true" />
            Creaciones recientes
          </p>
          <h2>Galeria de sabores</h2>
          <p>
            Texturas, flores, glace y terminaciones delicadas para imaginar el estilo
            de tu proximo pedido.
          </p>
        </motion.div>

        <div className="flavor-carousel" aria-label="Galeria animada de sabores Casa Dolce">
          <div className="flavor-carousel__stage">
            <button
              type="button"
              className="flavor-carousel__control flavor-carousel__control--prev"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Ver imagen anterior"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>

            <AnimatePresence mode="wait">
              <motion.figure
                key={activeImage.id}
                className="flavor-carousel__feature"
                initial={{ opacity: 0, scale: 0.96, x: 24 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98, x: -24 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={activeImage.src}
                  alt={activeImage.alt}
                  className="flavor-carousel__feature-image"
                  loading="lazy"
                  onError={() => handleImageError(activeIndex)}
                />
                <figcaption>
                  <span>Casa Dolce</span>
                  <strong>{activeImage.alt}</strong>
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            <button
              type="button"
              className="flavor-carousel__control flavor-carousel__control--next"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Ver imagen siguiente"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flavor-marquee" aria-hidden="true">
            <div className="flavor-marquee__track">
              {marqueeImages.map((image, index) => (
                <figure key={`${image.id}-${index}`}>
                  <img src={image.src} alt="" loading="lazy" onError={() => handleImageError(index)} />
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
