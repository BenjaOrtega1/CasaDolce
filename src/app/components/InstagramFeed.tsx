import { useEffect, useState, type SyntheticEvent } from "react";
import { motion } from "motion/react";
import { ExternalLink, Instagram } from "lucide-react";
import { siteConfig } from "../config/site";
import { instagramPosts as localInstagramPosts, type InstagramPost } from "./data/instagram";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1565853457079-562afb49d09f?w=900&h=900&fit=crop&auto=format&q=82";

function useFallbackImage(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = FALLBACK_IMAGE;
}

export function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>(localInstagramPosts);

  useEffect(() => {
    let mounted = true;

    import("../services/catalog")
      .then((module) => module.getMergedInstagramPosts())
      .then((items) => {
        if (mounted) setPosts(items.length ? items : localInstagramPosts);
      })
      .catch(() => {
        if (mounted) setPosts(localInstagramPosts);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="instagram" className="section-shell section-shell--instagram">
      <div className="section-inner">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="instagram-heading"
        >
          <p>SIGUENOS EN INSTAGRAM</p>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Abrir Instagram de ${siteConfig.name}`}
          >
            {siteConfig.instagramHandle.toUpperCase()}
          </a>
          <span aria-hidden="true" />
        </motion.div>

        <div className="instagram-grid">
          {posts.map((post, index) => (
            <motion.a
              key={`${post.id}-${post.postUrl}`}
              href={post.postUrl || siteConfig.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="instagram-post group aspect-square overflow-hidden rounded-2xl bg-secondary/40"
              aria-label={`${post.caption}. Ver publicacion en Instagram`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.035, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={post.image}
                alt={post.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={useFallbackImage}
              />
              <motion.div
                className="instagram-post__overlay"
                initial={false}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <Instagram className="size-9" aria-hidden="true" />
                <strong>Ver publicacion</strong>
              </motion.div>
            </motion.a>
          ))}
        </div>

        <div className="instagram-cta">
          <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2 px-6">
            Ver Instagram
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
