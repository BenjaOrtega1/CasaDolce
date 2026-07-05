import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { motion } from "motion/react";
import { CheckCircle, ImagePlus, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { siteConfig } from "../config/site";
import { supabase } from "../lib/supabase";
import { submitPublicReview, validateReviewInvite } from "../services/catalog";
import { convertImageToWebp, slugify } from "../utils/images";

const REVIEW_IMAGE_BUCKET = "review-images";

const initialForm = {
  name: "",
  event: "",
  text: "",
  rating: 5,
  image: "",
  alt: "",
};

function getReviewToken() {
  const hash = window.location.hash;
  const query = hash.includes("?") ? hash.slice(hash.indexOf("?") + 1) : "";
  return new URLSearchParams(query).get("token") ?? "";
}

async function uploadReviewImage(file: File, nameSeed: string, token: string) {
  if (!supabase) throw new Error("El formulario no esta disponible.");
  if (!file.type.startsWith("image/")) throw new Error("Selecciona una imagen valida.");

  const webpBlob = await convertImageToWebp(file, 1400, 0.84);
  const baseName = slugify(nameSeed || file.name.replace(/\.[^.]+$/, "")) || "resena";
  const path = `${token}/${baseName}-${Date.now()}.webp`;
  const { error } = await supabase.storage.from(REVIEW_IMAGE_BUCKET).upload(path, webpBlob, {
    contentType: "image/webp",
    upsert: false,
  });

  if (error) throw error;
  return supabase.storage.from(REVIEW_IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

export function ReviewForm() {
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sent, setSent] = useState(false);
  const [tokenState, setTokenState] = useState<"checking" | "valid" | "invalid">("checking");
  const [message, setMessage] = useState("");
  const token = useMemo(getReviewToken, []);

  const isValid = useMemo(
    () => Boolean(tokenState === "valid" && form.name.trim() && form.text.trim() && form.rating >= 1),
    [form, tokenState],
  );

  useEffect(() => {
    if (!supabase || !token) {
      setTokenState("invalid");
      return;
    }

    let mounted = true;
    validateReviewInvite(token)
      .then((isTokenValid) => {
        if (mounted) setTokenState(isTokenValid ? "valid" : "invalid");
      })
      .catch(() => {
        if (mounted) setTokenState("invalid");
      });

    return () => {
      mounted = false;
    };
  }, [token]);

  function getDroppedImage(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    return Array.from(event.dataTransfer.files).find((file) => file.type.startsWith("image/")) ?? null;
  }

  async function processReviewImage(file: File | null) {
    if (!file || tokenState !== "valid") return;

    setUploading(true);
    setMessage("Subiendo imagen...");
    try {
      const url = await uploadReviewImage(file, form.name || "cliente-casa-dolce", token);
      setForm((current) => ({
        ...current,
        image: url,
        alt: current.alt || `Foto de pedido enviada por ${current.name || "cliente Casa Dolce"}`,
      }));
      setPreview(URL.createObjectURL(file));
      setMessage("Imagen subida correctamente.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    await processReviewImage(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) {
      setMessage("Completa tu nombre, resena y estrellas.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      await submitPublicReview(token, {
        ...form,
        event: form.event.trim() || "Pedido Casa Dolce",
        alt: form.image ? form.alt || `Foto de pedido enviada por ${form.name}` : "",
      });
      setSent(true);
      setTokenState("invalid");
      setForm(initialForm);
      setPreview("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo enviar la resena.");
    } finally {
      setSaving(false);
    }
  }

  if (!supabase) {
    return (
      <main className="review-page">
        <section className="review-card review-card--compact">
          <img src="/logocasadolce.webp" alt={siteConfig.name} className="review-logo" />
          <h1>Resenas no disponibles</h1>
          <p>El formulario de resenas no esta disponible en este momento.</p>
        </section>
      </main>
    );
  }

  if (tokenState === "checking") {
    return (
      <main className="review-page">
        <section className="review-card review-card--compact">
          <img src="/logocasadolce.webp" alt={siteConfig.name} className="review-logo" />
          <h1>Validando link</h1>
          <p>Estamos revisando que esta invitacion de resena este disponible.</p>
        </section>
      </main>
    );
  }

  if (tokenState === "invalid" && !sent) {
    return (
      <main className="review-page">
        <section className="review-card review-card--compact">
          <img src="/logocasadolce.webp" alt={siteConfig.name} className="review-logo" />
          <h1>Link no disponible</h1>
          <p>Esta invitacion ya fue usada, vencio o no corresponde a un pedido activo.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="review-page">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="review-card"
      >
        <div className="review-card__intro">
          <img src="/logocasadolce.webp" alt={siteConfig.name} className="review-logo" />
          <span>Casa Dolce</span>
          <h1>Cuentanos como estuvo tu pedido</h1>
          <p>
            Tu resena ayuda a otras personas a imaginar su celebracion. Este link se puede usar una sola vez
            y la resena se publicara despues de ser revisada.
          </p>
        </div>

        {sent ? (
          <div className="review-success">
            <CheckCircle className="size-14" aria-hidden="true" />
            <h2>Gracias por tu resena</h2>
            <p>La recibimos correctamente. Casa Dolce la revisara antes de publicarla.</p>
          </div>
        ) : (
          <form className="review-form" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="field-group">
                <Label htmlFor="review-name">Nombre *</Label>
                <Input
                  id="review-name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="field-group">
                <Label htmlFor="review-event">Pedido o evento</Label>
                <Input
                  id="review-event"
                  value={form.event}
                  onChange={(event) => setForm({ ...form, event: event.target.value })}
                  placeholder="Cumpleanos, baby shower, torta personalizada..."
                />
              </div>
            </div>

            <fieldset className="review-stars">
              <legend>Cuantas estrellas le das?</legend>
              <div>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className={rating <= form.rating ? "is-active" : ""}
                    onClick={() => setForm({ ...form, rating })}
                    aria-label={`${rating} estrellas`}
                  >
                    <Star className="size-7" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="field-group">
              <Label htmlFor="review-text">Resena *</Label>
              <Textarea
                id="review-text"
                value={form.text}
                onChange={(event) => setForm({ ...form, text: event.target.value })}
                rows={5}
                placeholder="Cuentanos que te gusto del sabor, presentacion, atencion o entrega..."
                required
              />
            </div>

            <div className="review-upload-grid">
              <label
                className="admin-upload review-upload"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => processReviewImage(getDroppedImage(event))}
              >
                <ImagePlus className="size-5" aria-hidden="true" />
                <strong>{uploading ? "Subiendo imagen..." : "Subir imagen opcional"}</strong>
                <small>Imagen del pedido (opcional)</small>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading || saving} />
              </label>
              <figure className="review-image-preview">
                {form.image ? (
                  <img src={preview || form.image} alt={form.alt || "Vista previa de la foto de resena"} />
                ) : (
                  <figcaption>Si subes una imagen, aparecera aqui</figcaption>
                )}
              </figure>
            </div>

            {message ? <p className="admin-message">{message}</p> : null}

            <Button className="btn-primary h-12 w-full text-base" type="submit" disabled={saving || uploading}>
              {saving ? "Enviando resena..." : "Enviar resena"}
            </Button>
          </form>
        )}
      </motion.section>
    </main>
  );
}
