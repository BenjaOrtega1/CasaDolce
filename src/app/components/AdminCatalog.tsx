import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { Copy, Eye, ImagePlus, Images, Instagram, LogOut, Package, Plus, Save, Star, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  hasCatalogBackend,
  type CatalogProductInput,
  type CustomerReviewInput,
  type GalleryImageInput,
  type InstagramPostInput,
  type ReviewInvite,
  createReviewInvite,
  deleteGalleryImage,
  deleteInstagramPost,
  deleteProduct,
  deleteReview,
  getAdminGalleryImages,
  getAdminInstagramPosts,
  getAdminProducts,
  getAdminReviewInvites,
  getAdminReviews,
  saveGalleryImage,
  saveInstagramPost,
  saveProduct,
  saveReview,
} from "../services/catalog";
import { supabase } from "../lib/supabase";
import { convertImageToWebp, slugify } from "../utils/images";
import { useAppDialog } from "./AppDialog";

type AdminPanel = "products" | "gallery" | "instagram" | "reviews";

const PRODUCT_IMAGE_BUCKET = "product-images";
const GALLERY_IMAGE_BUCKET = "gallery-images";
const INSTAGRAM_IMAGE_BUCKET = "instagram-posts";
const REVIEW_IMAGE_BUCKET = "review-images";

const emptyProduct: CatalogProductInput = {
  name: "",
  description: "",
  category: "tortas",
  priceFrom: "",
  image: "",
  alt: "",
  tags: [],
  active: true,
  featured: false,
  sortOrder: 0,
};

const emptyGalleryImage: GalleryImageInput = {
  src: "",
  alt: "",
  active: true,
  sortOrder: 0,
};

const emptyInstagramPost: InstagramPostInput = {
  postUrl: "",
  image: "",
  alt: "",
  caption: "",
  active: true,
  sortOrder: 0,
};

const emptyReview: CustomerReviewInput = {
  name: "",
  event: "",
  text: "",
  rating: 5,
  image: "",
  alt: "",
  active: false,
  sortOrder: 0,
};

function tagsToText(tags: string[]) {
  return tags.join(", ");
}

function textToTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function ProductPreview({ product, tags }: { product: CatalogProductInput; tags: string[] }) {
  const image = product.image || "/instagram/post-02.webp";
  const title = product.name || "Nombre del producto";
  const description =
    product.description || "Descripcion breve del producto, pensada para verse igual que en el catalogo digital.";

  return (
    <article className="product-card admin-preview-card">
      <div className="product-card__media">
        <img src={image} alt={product.alt || title} className="h-full w-full object-cover" />
        <span className="product-card__price">{product.priceFrom || "desde $0"}</span>
      </div>
      <div className="product-card__body">
        <div className="flex flex-wrap gap-1.5">
          {(tags.length ? tags : ["Artesanal", "Casa Dolce"]).map((tag) => (
            <Badge key={tag} variant="secondary" className="tag-chip">
              {tag}
            </Badge>
          ))}
        </div>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <Button className="btn-primary mt-auto w-full" type="button">
          Vista del boton de cotizacion
        </Button>
      </div>
    </article>
  );
}

function GalleryPreview({ image }: { image: GalleryImageInput }) {
  return (
    <figure className="admin-gallery-preview">
      <img src={image.src || "/instagram/post-02.webp"} alt={image.alt || "Vista previa del carrusel"} />
      <figcaption>
        <span>Casa Dolce</span>
        <strong>{image.alt || "Texto descriptivo de la imagen"}</strong>
      </figcaption>
    </figure>
  );
}

function InstagramPreview({ post }: { post: InstagramPostInput }) {
  return (
    <a
      href={post.postUrl || "#"}
      target="_blank"
      rel="noreferrer"
      className="instagram-post admin-instagram-preview group aspect-square overflow-hidden rounded-2xl bg-secondary/40"
      aria-label={post.caption || "Vista previa de publicacion de Instagram"}
    >
      <img
        src={post.image || "/instagram/post-01.webp"}
        alt={post.alt || post.caption || "Publicacion de Instagram Casa Dolce"}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="instagram-post__overlay">
        <Instagram className="size-9" aria-hidden="true" />
        <strong>Ver publicacion</strong>
      </span>
    </a>
  );
}

function ReviewPreview({ review }: { review: CustomerReviewInput }) {
  const name = review.name || "Nombre del cliente";
  const event = review.event || "Pedido Casa Dolce";
  const text = review.text || "La reseña se verá aquí cuando el cliente escriba su experiencia.";

  return (
    <article className="testimonial-card admin-review-preview">
      {review.image ? (
        <img src={review.image} alt={review.alt || `Foto de reseña enviada por ${name}`} className="testimonial-card__image" />
      ) : null}
      <div className="flex gap-1" aria-label={`${review.rating} estrellas`}>
        {Array.from({ length: review.rating }).map((_, index) => (
          <Star key={index} className="size-4 fill-current text-[var(--gold)]" aria-hidden="true" />
        ))}
      </div>
      <p>"{text}"</p>
      <footer>
        <span className="testimonial-card__avatar">
          {name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </span>
        <span>
          <strong>{name}</strong>
          <small>{event}</small>
        </span>
      </footer>
    </article>
  );
}

export function AdminCatalog() {
  const dialog = useAppDialog();
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [panel, setPanel] = useState<AdminPanel>("products");
  const [products, setProducts] = useState<CatalogProductInput[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImageInput[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPostInput[]>([]);
  const [reviews, setReviews] = useState<CustomerReviewInput[]>([]);
  const [reviewInvites, setReviewInvites] = useState<ReviewInvite[]>([]);
  const [reviewInviteName, setReviewInviteName] = useState("");
  const [generatedReviewLink, setGeneratedReviewLink] = useState("");
  const [selectedId, setSelectedId] = useState<number | "new">("new");
  const [selectedGalleryId, setSelectedGalleryId] = useState<number | "new">("new");
  const [selectedInstagramId, setSelectedInstagramId] = useState<number | "new">("new");
  const [selectedReviewId, setSelectedReviewId] = useState<number | "new">("new");
  const [form, setForm] = useState<CatalogProductInput>(emptyProduct);
  const [galleryForm, setGalleryForm] = useState<GalleryImageInput>(emptyGalleryImage);
  const [instagramForm, setInstagramForm] = useState<InstagramPostInput>(emptyInstagramPost);
  const [reviewForm, setReviewForm] = useState<CustomerReviewInput>(emptyReview);
  const [tagsText, setTagsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const previewTags = useMemo(() => textToTags(tagsText), [tagsText]);
  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId),
    [products, selectedId],
  );
  const selectedGalleryImage = useMemo(
    () => galleryImages.find((image) => image.id === selectedGalleryId),
    [galleryImages, selectedGalleryId],
  );
  const selectedInstagramPost = useMemo(
    () => instagramPosts.find((post) => post.id === selectedInstagramId),
    [instagramPosts, selectedInstagramId],
  );
  const selectedReview = useMemo(
    () => reviews.find((review) => review.id === selectedReviewId),
    [reviews, selectedReviewId],
  );
  const reviewBaseLink = useMemo(() => `${window.location.origin}${window.location.pathname}#resena`, []);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    refreshAll();
  }, [session]);

  useEffect(() => {
    if (selectedProduct) {
      setForm(selectedProduct);
      setTagsText(tagsToText(selectedProduct.tags));
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedGalleryImage) setGalleryForm(selectedGalleryImage);
  }, [selectedGalleryImage]);

  useEffect(() => {
    if (selectedInstagramPost) setInstagramForm(selectedInstagramPost);
  }, [selectedInstagramPost]);

  useEffect(() => {
    if (selectedReview) setReviewForm(selectedReview);
  }, [selectedReview]);

  async function refreshAll() {
    setLoading(true);
    setMessage("");
    const [productResult, galleryResult, instagramResult, reviewResult, inviteResult] = await Promise.allSettled([
      getAdminProducts(),
      getAdminGalleryImages(),
      getAdminInstagramPosts(),
      getAdminReviews(),
      getAdminReviewInvites(),
    ]);

    if (productResult.status === "fulfilled") setProducts(productResult.value);
    if (galleryResult.status === "fulfilled") setGalleryImages(galleryResult.value);
    if (instagramResult.status === "fulfilled") setInstagramPosts(instagramResult.value);
    if (reviewResult.status === "fulfilled") setReviews(reviewResult.value);
    if (inviteResult.status === "fulfilled") setReviewInvites(inviteResult.value);

    const mainError =
      productResult.status === "rejected" ? productResult.reason : galleryResult.status === "rejected" ? galleryResult.reason : null;
    if (mainError) {
      setMessage(mainError instanceof Error ? mainError.message : "No se pudo cargar la informacion.");
    }

    setLoading(false);
  }

  function startNewProduct() {
    setSelectedId("new");
    setForm(emptyProduct);
    setTagsText("");
  }

  function startNewGalleryImage() {
    setSelectedGalleryId("new");
    setGalleryForm({
      ...emptyGalleryImage,
      sortOrder: galleryImages.length,
    });
  }

  function startNewInstagramPost() {
    setSelectedInstagramId("new");
    setInstagramForm({
      ...emptyInstagramPost,
      sortOrder: instagramPosts.length,
    });
  }

  function startNewReview() {
    setSelectedReviewId("new");
    setReviewForm({
      ...emptyReview,
      sortOrder: reviews.length,
    });
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setMessage(error.message);
  }

  async function uploadWebp(file: File, bucket: string, nameSeed: string) {
    if (!supabase) throw new Error("Supabase no esta configurado.");
    if (!file.type.startsWith("image/")) throw new Error("Selecciona una imagen valida.");

    const webpBlob = await convertImageToWebp(file);
    const baseName = slugify(nameSeed || file.name.replace(/\.[^.]+$/, "")) || "imagen";
    const path = `${baseName}-${Date.now()}.webp`;
    const { error } = await supabase.storage.from(bucket).upload(path, webpBlob, {
      contentType: "image/webp",
      upsert: false,
    });

    if (error) throw error;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  function getDroppedImage(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    return Array.from(event.dataTransfer.files).find((file) => file.type.startsWith("image/")) ?? null;
  }

  async function processProductImage(file: File | null) {
    if (!file) return;

    setUploading(true);
    setMessage("Subiendo imagen...");
    try {
      const url = await uploadWebp(file, PRODUCT_IMAGE_BUCKET, form.name);
      setForm((current) => ({
        ...current,
        image: url,
        alt: current.alt || current.name || "Producto artesanal Casa Dolce",
      }));
      setMessage("Imagen de producto subida.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
    }
  }

  async function handleProductImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    await processProductImage(file);
  }

  async function processGalleryImage(file: File | null) {
    if (!file) return;

    setUploading(true);
    setMessage("Subiendo imagen...");
    try {
      const url = await uploadWebp(file, GALLERY_IMAGE_BUCKET, galleryForm.alt || "galeria");
      setGalleryForm((current) => ({
        ...current,
        src: url,
        alt: current.alt || "Creacion artesanal Casa Dolce",
      }));
      setMessage("Imagen del carrusel subida.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo subir la imagen del carrusel.");
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    await processGalleryImage(file);
  }

  async function processInstagramImage(file: File | null) {
    if (!file) return;

    setUploading(true);
    setMessage("Subiendo imagen...");
    try {
      const url = await uploadWebp(file, INSTAGRAM_IMAGE_BUCKET, instagramForm.caption || "instagram");
      setInstagramForm((current) => ({
        ...current,
        image: url,
        alt: current.alt || current.caption || "Publicacion de Instagram Casa Dolce",
      }));
      setMessage("Imagen de Instagram subida.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo subir la imagen de Instagram.");
    } finally {
      setUploading(false);
    }
  }

  async function handleInstagramImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    await processInstagramImage(file);
  }

  async function processReviewImage(file: File | null) {
    if (!file) return;

    setUploading(true);
    setMessage("Subiendo imagen...");
    try {
      const url = await uploadWebp(file, REVIEW_IMAGE_BUCKET, reviewForm.name || "resena");
      setReviewForm((current) => ({
        ...current,
        image: url,
        alt: current.alt || `Foto de pedido enviada por ${current.name || "cliente Casa Dolce"}`,
      }));
      setMessage("Imagen de reseña subida.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo subir la imagen de reseña.");
    } finally {
      setUploading(false);
    }
  }

  async function handleReviewImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";
    await processReviewImage(file);
  }

  async function handleSaveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await saveProduct({ ...form, tags: previewTags });
      setMessage("Producto guardado.");
      startNewProduct();
      await refreshAll();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar el producto.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveGalleryImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await saveGalleryImage(galleryForm);
      setMessage("Imagen del carrusel guardada.");
      startNewGalleryImage();
      await refreshAll();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar la imagen.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveInstagramPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const caption = instagramForm.caption.trim() || "Publicacion Casa Dolce";
      await saveInstagramPost({
        ...instagramForm,
        caption,
        alt: instagramForm.alt.trim() || caption,
        postUrl: instagramForm.postUrl.trim(),
      });
      setMessage("Publicacion de Instagram guardada.");
      startNewInstagramPost();
      await refreshAll();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar la publicacion.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await saveReview({
        ...reviewForm,
        name: reviewForm.name.trim(),
        event: reviewForm.event.trim() || "Pedido Casa Dolce",
        text: reviewForm.text.trim(),
        alt: reviewForm.alt.trim() || `Foto de pedido enviada por ${reviewForm.name}`,
      });
      setMessage("Reseña guardada.");
      startNewReview();
      await refreshAll();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar la reseña.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateReviewInvite() {
    setLoading(true);
    setMessage("");

    try {
      const invite = await createReviewInvite(reviewInviteName);
      const nextLink = `${reviewBaseLink}?token=${invite.token}`;
      setGeneratedReviewLink(nextLink);
      setReviewInviteName("");
      await navigator.clipboard.writeText(nextLink);
      setMessage("Link único de reseña creado y copiado.");
      await refreshAll();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo crear el link de reseña.");
    } finally {
      setLoading(false);
    }
  }

  async function copyReviewLink(link = generatedReviewLink) {
    if (!link) {
      setMessage("Primero genera un link único para este pedido.");
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      setMessage("Link para reseñas copiado.");
    } catch {
      setMessage(`Link para reseñas: ${link}`);
    }
  }
  async function handleDeleteProduct(id?: number) {
    if (
      !id ||
      !(await dialog.confirm({
        title: "Eliminar producto",
        description: "Esta accion quitara el producto del catalogo. No se puede deshacer.",
        confirmLabel: "Eliminar producto",
        tone: "danger",
      }))
    ) {
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await deleteProduct(id);
      setMessage("Producto eliminado.");
      startNewProduct();
      await refreshAll();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar el producto.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteGalleryImage(id?: number) {
    if (
      !id ||
      !(await dialog.confirm({
        title: "Eliminar imagen del carrusel",
        description: "La imagen dejara de mostrarse en la galeria de sabores.",
        confirmLabel: "Eliminar imagen",
        tone: "danger",
      }))
    ) {
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await deleteGalleryImage(id);
      setMessage("Imagen del carrusel eliminada.");
      startNewGalleryImage();
      await refreshAll();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar la imagen.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteInstagramPost(id?: number) {
    if (
      !id ||
      !(await dialog.confirm({
        title: "Eliminar publicacion",
        description: "Esta publicacion dejara de aparecer en el feed de Instagram de la web.",
        confirmLabel: "Eliminar publicacion",
        tone: "danger",
      }))
    ) {
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await deleteInstagramPost(id);
      setMessage("Publicacion de Instagram eliminada.");
      startNewInstagramPost();
      await refreshAll();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar la publicacion.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteReview(id?: number) {
    if (
      !id ||
      !(await dialog.confirm({
        title: "Eliminar resena",
        description: "Esta resena dejara de mostrarse como testimonio en el sitio.",
        confirmLabel: "Eliminar resena",
        tone: "danger",
      }))
    ) {
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await deleteReview(id);
      setMessage("Reseña eliminada.");
      startNewReview();
      await refreshAll();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo eliminar la reseña.");
    } finally {
      setLoading(false);
    }
  }

  if (!hasCatalogBackend()) {
    return (
      <main className="admin-page">
        <section className="admin-card admin-card--narrow">
          <img src="/logocasadolce.webp" alt="Casa Dolce" className="admin-logo" />
          <h1>Configura Supabase</h1>
          <p>
            Crea un archivo <code>.env</code> usando <code>.env.example</code> y agrega
            <code> VITE_SUPABASE_URL</code> y <code> VITE_SUPABASE_ANON_KEY</code>.
          </p>
        </section>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-page">
        <form className="admin-card admin-card--narrow" onSubmit={handleLogin}>
          <img src="/logocasadolce.webp" alt="Casa Dolce" className="admin-logo" />
          <h1>Administrar catalogo</h1>
          <p>Ingresa con el usuario creado en Supabase Auth.</p>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </label>
          <label>
            Contrasena
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
          </label>
          {message && <p className="admin-message">{message}</p>}
          <Button className="btn-primary" type="submit" disabled={loading}>
            Entrar
          </Button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <header className="admin-header">
          <div>
            <p>Casa Dolce</p>
            <h1>
              {panel === "products"
                ? "Catalogo digital"
                : panel === "gallery"
                  ? "Carrusel de sabores"
                  : panel === "instagram"
                    ? "Publicaciones de Instagram"
                    : "Reseñas de clientes"}
            </h1>
          </div>
          <div className="admin-header__actions">
            <Button type="button" variant="outline" className="btn-secondary" onClick={() => window.open("/#galeria", "_blank")}>
              <Eye className="size-4" aria-hidden="true" />
              Ver sitio
            </Button>
            <Button type="button" variant="outline" className="btn-secondary" onClick={() => supabase?.auth.signOut()}>
              <LogOut className="size-4" aria-hidden="true" />
              Salir
            </Button>
          </div>
        </header>

        <div className="admin-tabs" role="tablist" aria-label="Administracion Casa Dolce">
          <button type="button" className={panel === "products" ? "is-active" : ""} onClick={() => setPanel("products")}>
            <Package className="size-4" aria-hidden="true" />
            Productos
          </button>
          <button type="button" className={panel === "gallery" ? "is-active" : ""} onClick={() => setPanel("gallery")}>
            <Images className="size-4" aria-hidden="true" />
            Carrusel
          </button>
          <button type="button" className={panel === "instagram" ? "is-active" : ""} onClick={() => setPanel("instagram")}>
            <Instagram className="size-4" aria-hidden="true" />
            Instagram
          </button>
          <button type="button" className={panel === "reviews" ? "is-active" : ""} onClick={() => setPanel("reviews")}>
            <Star className="size-4" aria-hidden="true" />
            Reseñas
          </button>
        </div>

        {panel === "products" && (
          <div className="admin-grid admin-grid--preview">
            <aside className="admin-list">
              <button type="button" className={`admin-list__item ${selectedId === "new" ? "is-active" : ""}`} onClick={startNewProduct}>
                <Plus className="size-4" aria-hidden="true" />
                Nuevo producto
              </button>
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className={`admin-list__item ${selectedId === product.id ? "is-active" : ""}`}
                  onClick={() => setSelectedId(product.id ?? "new")}
                >
                  <span>{product.name}</span>
                  {!product.active && <small>Oculto</small>}
                </button>
              ))}
            </aside>

            <form className="admin-form" onSubmit={handleSaveProduct}>
              <div className="admin-form__section">
                <span>Contenido</span>
                <div className="admin-form__row">
                  <label>
                    Nombre
                    <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
                  </label>
                  <label>
                    Categoria
                    <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
                  </label>
                </div>
                <label>
                  Descripcion
                  <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
                </label>
                <div className="admin-form__row">
                  <label>
                    Precio visible
                    <input value={form.priceFrom} onChange={(event) => setForm({ ...form, priceFrom: event.target.value })} />
                  </label>
                  <label>
                    Orden
                    <input value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} type="number" />
                  </label>
                </div>
              </div>

              <div className="admin-form__section">
                <span>Imagen</span>
                <label className="admin-upload" onDragOver={(event) => event.preventDefault()} onDrop={(event) => processProductImage(getDroppedImage(event))}>
                  <ImagePlus className="size-5" aria-hidden="true" />
                  <strong>{uploading ? "Subiendo imagen..." : "Subir imagen"}</strong>
                  <small>Producto</small>
                  <input type="file" accept="image/*" onChange={handleProductImageUpload} disabled={uploading} />
                </label>
                <label>
                  URL de imagen
                  <input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} required />
                </label>
                <label>
                  Texto alt
                  <input value={form.alt} onChange={(event) => setForm({ ...form, alt: event.target.value })} />
                </label>
              </div>

              <div className="admin-form__section">
                <span>Publicacion</span>
                <label>
                  Tags separados por coma
                  <input value={tagsText} onChange={(event) => setTagsText(event.target.value)} />
                </label>
                <div className="admin-checks">
                  <label>
                    <input checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} type="checkbox" />
                    Visible en el catalogo
                  </label>
                  <label>
                    <input checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} type="checkbox" />
                    Destacado
                  </label>
                </div>
              </div>

              {message && <p className="admin-message">{message}</p>}
              <div className="admin-actions">
                <Button className="btn-primary" type="submit" disabled={loading || uploading}>
                  <Save className="size-4" aria-hidden="true" />
                  Guardar producto
                </Button>
                {form.id && (
                  <Button type="button" variant="outline" className="btn-secondary" onClick={() => handleDeleteProduct(form.id)}>
                    <Trash2 className="size-4" aria-hidden="true" />
                    Eliminar
                  </Button>
                )}
              </div>
            </form>

            <aside className="admin-preview">
              <div className="admin-preview__header">
                <span>Vista previa</span>
                <p>Asi se vera en el catalogo digital.</p>
              </div>
              <ProductPreview product={form} tags={previewTags} />
            </aside>
          </div>
        )}

        {panel === "gallery" && (
          <div className="admin-grid admin-grid--preview">
            <aside className="admin-list">
              <button type="button" className={`admin-list__item ${selectedGalleryId === "new" ? "is-active" : ""}`} onClick={startNewGalleryImage}>
                <Plus className="size-4" aria-hidden="true" />
                Nueva imagen
              </button>
              {galleryImages.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  className={`admin-list__item ${selectedGalleryId === image.id ? "is-active" : ""}`}
                  onClick={() => setSelectedGalleryId(image.id ?? "new")}
                >
                  <span>{image.alt || "Imagen sin titulo"}</span>
                  {!image.active && <small>Oculta</small>}
                </button>
              ))}
            </aside>

            <form className="admin-form" onSubmit={handleSaveGalleryImage}>
              <div className="admin-form__section">
                <span>Imagen del carrusel</span>
                <label className="admin-upload" onDragOver={(event) => event.preventDefault()} onDrop={(event) => processGalleryImage(getDroppedImage(event))}>
                  <ImagePlus className="size-5" aria-hidden="true" />
                  <strong>{uploading ? "Subiendo imagen..." : "Subir imagen"}</strong>
                  <small>Carrusel</small>
                  <input type="file" accept="image/*" onChange={handleGalleryImageUpload} disabled={uploading} />
                </label>
                <label>
                  URL de imagen
                  <input value={galleryForm.src} onChange={(event) => setGalleryForm({ ...galleryForm, src: event.target.value })} required />
                </label>
                <label>
                  Texto descriptivo
                  <input value={galleryForm.alt} onChange={(event) => setGalleryForm({ ...galleryForm, alt: event.target.value })} required />
                </label>
                <div className="admin-form__row">
                  <label>
                    Orden
                    <input value={galleryForm.sortOrder} onChange={(event) => setGalleryForm({ ...galleryForm, sortOrder: Number(event.target.value) })} type="number" />
                  </label>
                  <label>
                    Estado
                    <span className="admin-inline-check">
                      <input checked={galleryForm.active} onChange={(event) => setGalleryForm({ ...galleryForm, active: event.target.checked })} type="checkbox" />
                      Visible en el carrusel
                    </span>
                  </label>
                </div>
              </div>

              {message && <p className="admin-message">{message}</p>}
              <div className="admin-actions">
                <Button className="btn-primary" type="submit" disabled={loading || uploading}>
                  <Save className="size-4" aria-hidden="true" />
                  Guardar imagen
                </Button>
                {galleryForm.id && (
                  <Button type="button" variant="outline" className="btn-secondary" onClick={() => handleDeleteGalleryImage(galleryForm.id)}>
                    <Trash2 className="size-4" aria-hidden="true" />
                    Eliminar
                  </Button>
                )}
              </div>
            </form>

            <aside className="admin-preview">
              <div className="admin-preview__header">
                <span>Vista previa</span>
                <p>Asi se vera dentro del carrusel.</p>
              </div>
              <GalleryPreview image={galleryForm} />
            </aside>
          </div>
        )}

        {panel === "instagram" && (
          <div className="admin-grid admin-grid--preview">
            <aside className="admin-list">
              <button type="button" className={`admin-list__item ${selectedInstagramId === "new" ? "is-active" : ""}`} onClick={startNewInstagramPost}>
                <Plus className="size-4" aria-hidden="true" />
                Nueva publicacion
              </button>
              {instagramPosts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  className={`admin-list__item ${selectedInstagramId === post.id ? "is-active" : ""}`}
                  onClick={() => setSelectedInstagramId(post.id ?? "new")}
                >
                  <span>{post.caption || "Publicacion sin titulo"}</span>
                  {!post.active && <small>Oculta</small>}
                </button>
              ))}
            </aside>

            <form className="admin-form" onSubmit={handleSaveInstagramPost}>
              <div className="admin-form__section">
                <span>Publicacion</span>
                <label>
                  Link de Instagram
                  <input
                    value={instagramForm.postUrl}
                    onChange={(event) => setInstagramForm({ ...instagramForm, postUrl: event.target.value })}
                    placeholder="https://www.instagram.com/p/..."
                    required
                  />
                </label>
                <label>
                  Caption
                  <input
                    value={instagramForm.caption}
                    onChange={(event) =>
                      setInstagramForm({
                        ...instagramForm,
                        caption: event.target.value,
                        alt: instagramForm.alt || event.target.value,
                      })
                    }
                    placeholder="Torta personalizada para celebracion"
                    required
                  />
                </label>
              </div>

              <div className="admin-form__section">
                <span>Imagen manual</span>
                <label className="admin-upload" onDragOver={(event) => event.preventDefault()} onDrop={(event) => processInstagramImage(getDroppedImage(event))}>
                  <ImagePlus className="size-5" aria-hidden="true" />
                  <strong>{uploading ? "Subiendo imagen..." : "Subir imagen"}</strong>
                  <small>Instagram</small>
                  <input type="file" accept="image/*" onChange={handleInstagramImageUpload} disabled={uploading} />
                </label>
                <label>
                  URL de imagen
                  <input value={instagramForm.image} onChange={(event) => setInstagramForm({ ...instagramForm, image: event.target.value })} required />
                </label>
                <label>
                  Texto alt
                  <input
                    value={instagramForm.alt}
                    onChange={(event) => setInstagramForm({ ...instagramForm, alt: event.target.value })}
                    placeholder="Torta artesanal decorada de Casa Dolce"
                  />
                </label>
                <div className="admin-form__row">
                  <label>
                    Orden
                    <input
                      value={instagramForm.sortOrder}
                      onChange={(event) => setInstagramForm({ ...instagramForm, sortOrder: Number(event.target.value) })}
                      type="number"
                    />
                  </label>
                  <label>
                    Estado
                    <span className="admin-inline-check">
                      <input
                        checked={instagramForm.active}
                        onChange={(event) => setInstagramForm({ ...instagramForm, active: event.target.checked })}
                        type="checkbox"
                      />
                      Visible en Instagram
                    </span>
                  </label>
                </div>
              </div>

              {message && <p className="admin-message">{message}</p>}
              <div className="admin-actions">
                <Button className="btn-primary" type="submit" disabled={loading || uploading}>
                  <Save className="size-4" aria-hidden="true" />
                  Guardar publicacion
                </Button>
                {instagramForm.id && (
                  <Button type="button" variant="outline" className="btn-secondary" onClick={() => handleDeleteInstagramPost(instagramForm.id)}>
                    <Trash2 className="size-4" aria-hidden="true" />
                    Eliminar
                  </Button>
                )}
              </div>
            </form>

            <aside className="admin-preview">
              <div className="admin-preview__header">
                <span>Vista previa</span>
                <p>Asi se vera en la grilla de Instagram.</p>
              </div>
              <InstagramPreview post={instagramForm} />
            </aside>
          </div>
        )}

        {panel === "reviews" && (
          <div className="admin-grid admin-grid--preview">
            <aside className="admin-list">
              <button type="button" className="admin-list__item" onClick={() => copyReviewLink()}>
                <Copy className="size-4" aria-hidden="true" />
                Copiar link de reseña
              </button>
              <button type="button" className={`admin-list__item ${selectedReviewId === "new" ? "is-active" : ""}`} onClick={startNewReview}>
                <Plus className="size-4" aria-hidden="true" />
                Nueva reseña manual
              </button>
              {reviews.map((review) => (
                <button
                  key={review.id}
                  type="button"
                  className={`admin-list__item ${selectedReviewId === review.id ? "is-active" : ""}`}
                  onClick={() => setSelectedReviewId(review.id ?? "new")}
                >
                  <span>{review.name || "Reseña sin nombre"}</span>
                  {!review.active && <small>Pendiente</small>}
                </button>
              ))}
            </aside>

            <form className="admin-form" onSubmit={handleSaveReview}>
              <div className="admin-form__section">
                <span>Link único para clientes</span>
                <label>
                  Nombre interno del cliente o pedido
                  <input
                    value={reviewInviteName}
                    onChange={(event) => setReviewInviteName(event.target.value)}
                    placeholder="Ej: Camila - torta cumpleaños"
                  />
                </label>
                <label>
                  Último link generado
                  <input value={generatedReviewLink || "Genera un link para copiarlo aquí"} readOnly onFocus={(event) => event.currentTarget.select()} />
                </label>
                <div className="admin-actions">
                  <Button type="button" className="btn-primary" onClick={handleCreateReviewInvite} disabled={loading}>
                    <Plus className="size-4" aria-hidden="true" />
                    Generar link único
                  </Button>
                  <Button type="button" variant="outline" className="btn-secondary" onClick={() => copyReviewLink()}>
                    <Copy className="size-4" aria-hidden="true" />
                    Copiar link
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="btn-secondary"
                    onClick={() => generatedReviewLink && window.open(generatedReviewLink, "_blank")}
                    disabled={!generatedReviewLink}
                  >
                    <Eye className="size-4" aria-hidden="true" />
                    Abrir formulario
                  </Button>
                </div>
                <div className="admin-invite-list">
                  {reviewInvites.slice(0, 6).map((invite) => {
                    const inviteLink = `${reviewBaseLink}?token=${invite.token}`;
                    return (
                      <button type="button" key={invite.id} onClick={() => copyReviewLink(inviteLink)}>
                        <span>{invite.customerName || "Invitación sin nombre"}</span>
                        <small>{invite.usedAt ? "Usada" : "Disponible"}</small>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="admin-form__section">
                <span>Reseña</span>
                <div className="admin-form__row">
                  <label>
                    Nombre del cliente
                    <input value={reviewForm.name} onChange={(event) => setReviewForm({ ...reviewForm, name: event.target.value })} required />
                  </label>
                  <label>
                    Pedido o evento
                    <input
                      value={reviewForm.event}
                      onChange={(event) => setReviewForm({ ...reviewForm, event: event.target.value })}
                      placeholder="Cumpleaños, torta personalizada..."
                    />
                  </label>
                </div>
                <label>
                  Reseña
                  <textarea value={reviewForm.text} onChange={(event) => setReviewForm({ ...reviewForm, text: event.target.value })} required />
                </label>
                <div className="admin-form__row">
                  <label>
                    Estrellas
                    <input
                      value={reviewForm.rating}
                      min={1}
                      max={5}
                      onChange={(event) => setReviewForm({ ...reviewForm, rating: Number(event.target.value) })}
                      type="number"
                    />
                  </label>
                  <label>
                    Orden
                    <input
                      value={reviewForm.sortOrder}
                      onChange={(event) => setReviewForm({ ...reviewForm, sortOrder: Number(event.target.value) })}
                      type="number"
                    />
                  </label>
                </div>
              </div>

              <div className="admin-form__section">
                <span>Imagen</span>
                <label className="admin-upload" onDragOver={(event) => event.preventDefault()} onDrop={(event) => processReviewImage(getDroppedImage(event))}>
                  <ImagePlus className="size-5" aria-hidden="true" />
                  <strong>{uploading ? "Subiendo imagen..." : "Subir imagen"}</strong>
                  <small>Imagen de reseña</small>
                  <input type="file" accept="image/*" onChange={handleReviewImageUpload} disabled={uploading} />
                </label>
                <label>
                  URL de imagen
                  <input value={reviewForm.image} onChange={(event) => setReviewForm({ ...reviewForm, image: event.target.value })} required />
                </label>
                <label>
                  Texto alt
                  <input
                    value={reviewForm.alt}
                    onChange={(event) => setReviewForm({ ...reviewForm, alt: event.target.value })}
                    placeholder="Foto del pedido enviada por cliente Casa Dolce"
                  />
                </label>
                <label>
                  Estado
                  <span className="admin-inline-check">
                    <input
                      checked={reviewForm.active}
                      onChange={(event) => setReviewForm({ ...reviewForm, active: event.target.checked })}
                      type="checkbox"
                    />
                    Visible en testimonios
                  </span>
                </label>
              </div>

              {message && <p className="admin-message">{message}</p>}
              <div className="admin-actions">
                <Button className="btn-primary" type="submit" disabled={loading || uploading}>
                  <Save className="size-4" aria-hidden="true" />
                  Guardar reseña
                </Button>
                {reviewForm.id && (
                  <Button type="button" variant="outline" className="btn-secondary" onClick={() => handleDeleteReview(reviewForm.id)}>
                    <Trash2 className="size-4" aria-hidden="true" />
                    Eliminar
                  </Button>
                )}
              </div>
            </form>

            <aside className="admin-preview">
              <div className="admin-preview__header">
                <span>Vista previa</span>
                <p>Así se verá en la sección de testimonios cuando esté visible.</p>
              </div>
              <ReviewPreview review={reviewForm} />
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}







