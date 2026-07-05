import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MessageCircle, Tag } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { products as fallbackProducts, type Product } from "./data/products";
import { buildWhatsAppUrl } from "../config/site";

function buildProductMessage(productName: string) {
  return `Hola! Me gustaría cotizar: *${productName}*. ¿Podrían darme más información?`;
}

export function Catalog() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    import("../services/catalog")
      .then((module) => module.getPublicProducts())
      .then((items) => {
        if (mounted) setProducts(items);
      })
      .catch(() => {
        if (mounted) setProducts(fallbackProducts);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="catalogo" className="section-shell section-shell--light">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="section-heading"
        >
          <p className="section-kicker">
            <Tag className="size-4" aria-hidden="true" />
            Nuestros productos
          </p>
          <h2>Catálogo artesanal</h2>
          <p>
            Cada pieza se prepara a mano con ingredientes de primera calidad.
            Personalizamos detalles, porciones y terminaciones para tu celebración.
          </p>
        </motion.div>

        {loading && <p className="catalog-status">Cargando catálogo...</p>}

        <div className="product-grid">
          {products.map((product, i) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.58, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
              className="product-card"
            >
              <div className="product-card__media">
                <img
                  src={product.image}
                  alt={product.alt}
                  className="h-full w-full object-cover"
                  loading={i < 2 ? "eager" : "lazy"}
                />
                <span className="product-card__price">{product.priceFrom}</span>
              </div>

              <div className="product-card__body">
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="tag-chip">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>
                <Button asChild className="btn-primary mt-auto w-full">
                  <a
                    href={buildWhatsAppUrl(buildProductMessage(product.name))}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Cotizar ${product.name} por WhatsApp`}
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Cotizar este producto
                  </a>
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
