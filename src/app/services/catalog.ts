import { instagramPosts as fallbackInstagramPosts, type InstagramPost } from "../components/data/instagram";
import { galleryImages as fallbackGalleryImages, products as fallbackProducts, type Product } from "../components/data/products";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  span?: string;
}

export interface CatalogProductInput {
  id?: number;
  name: string;
  description: string;
  category: string;
  priceFrom: string;
  image: string;
  alt: string;
  tags: string[];
  active: boolean;
  featured: boolean;
  sortOrder: number;
}

export interface GalleryImageInput {
  id?: number;
  src: string;
  alt: string;
  active: boolean;
  sortOrder: number;
}

export interface InstagramPostInput {
  id?: number;
  postUrl: string;
  image: string;
  alt: string;
  caption: string;
  active: boolean;
  sortOrder: number;
}

export interface CustomerReview {
  id: number;
  name: string;
  event: string;
  text: string;
  rating: number;
  image: string;
  alt: string;
}

export interface CustomerReviewInput {
  id?: number;
  name: string;
  event: string;
  text: string;
  rating: number;
  image: string;
  alt: string;
  active: boolean;
  sortOrder: number;
}

export interface ReviewInvite {
  id: number;
  token: string;
  customerName: string;
  usedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

interface ProductRow {
  id: number;
  name: string;
  description: string;
  category: string;
  price_from: string;
  image_url: string;
  alt: string;
  tags: string[] | null;
  active: boolean;
  featured: boolean;
  sort_order: number;
}

interface GalleryImageRow {
  id: number;
  image_url: string;
  alt: string;
  active: boolean;
  sort_order: number;
}

interface InstagramPostRow {
  id: number;
  post_url: string;
  image_url: string;
  alt: string;
  caption: string;
  active: boolean;
  sort_order: number;
}

interface CustomerReviewRow {
  id: number;
  customer_name: string;
  event_name: string;
  review_text: string;
  rating: number;
  image_url: string;
  alt: string;
  active: boolean;
  sort_order: number;
}

interface ReviewInviteRow {
  id: number;
  token: string;
  customer_name: string | null;
  used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

const productColumns =
  "id,name,description,category,price_from,image_url,alt,tags,active,featured,sort_order";
const galleryColumns = "id,image_url,alt,active,sort_order";
const instagramColumns = "id,post_url,image_url,alt,caption,active,sort_order";
const reviewColumns = "id,customer_name,event_name,review_text,rating,image_url,alt,active,sort_order";
const reviewInviteColumns = "id,token,customer_name,used_at,expires_at,created_at";

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    priceFrom: row.price_from,
    image: row.image_url,
    alt: row.alt,
    tags: row.tags ?? [],
  };
}

function rowToInput(row: ProductRow): CatalogProductInput {
  return {
    ...rowToProduct(row),
    active: row.active,
    featured: row.featured,
    sortOrder: row.sort_order,
  };
}

function inputToRow(product: CatalogProductInput) {
  return {
    name: product.name.trim(),
    description: product.description.trim(),
    category: product.category.trim() || "general",
    price_from: product.priceFrom.trim(),
    image_url: product.image.trim(),
    alt: product.alt.trim(),
    tags: product.tags.map((tag) => tag.trim()).filter(Boolean),
    active: product.active,
    featured: product.featured,
    sort_order: Number.isFinite(product.sortOrder) ? product.sortOrder : 0,
  };
}

function galleryRowToImage(row: GalleryImageRow): GalleryImage {
  return {
    id: row.id,
    src: row.image_url,
    alt: row.alt,
    span: "normal",
  };
}

function galleryRowToInput(row: GalleryImageRow): GalleryImageInput {
  return {
    id: row.id,
    src: row.image_url,
    alt: row.alt,
    active: row.active,
    sortOrder: row.sort_order,
  };
}

function galleryInputToRow(image: GalleryImageInput) {
  return {
    image_url: image.src.trim(),
    alt: image.alt.trim(),
    active: image.active,
    sort_order: Number.isFinite(image.sortOrder) ? image.sortOrder : 0,
  };
}

function instagramRowToPost(row: InstagramPostRow): InstagramPost {
  return {
    id: row.id,
    postUrl: row.post_url,
    image: row.image_url,
    alt: row.alt,
    caption: row.caption,
  };
}

function instagramRowToInput(row: InstagramPostRow): InstagramPostInput {
  return {
    ...instagramRowToPost(row),
    active: row.active,
    sortOrder: row.sort_order,
  };
}

function instagramInputToRow(post: InstagramPostInput) {
  return {
    post_url: post.postUrl.trim(),
    image_url: post.image.trim(),
    alt: post.alt.trim(),
    caption: post.caption.trim(),
    active: post.active,
    sort_order: Number.isFinite(post.sortOrder) ? post.sortOrder : 0,
  };
}

function reviewRowToReview(row: CustomerReviewRow): CustomerReview {
  return {
    id: row.id,
    name: row.customer_name,
    event: row.event_name,
    text: row.review_text,
    rating: row.rating,
    image: row.image_url,
    alt: row.alt,
  };
}

function reviewRowToInput(row: CustomerReviewRow): CustomerReviewInput {
  return {
    ...reviewRowToReview(row),
    active: row.active,
    sortOrder: row.sort_order,
  };
}

function reviewInputToRow(review: CustomerReviewInput) {
  return {
    customer_name: review.name.trim(),
    event_name: review.event.trim(),
    review_text: review.text.trim(),
    rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
    image_url: review.image.trim(),
    alt: review.alt.trim(),
    active: review.active,
    sort_order: Number.isFinite(review.sortOrder) ? review.sortOrder : 0,
  };
}

function reviewInviteRowToInvite(row: ReviewInviteRow): ReviewInvite {
  return {
    id: row.id,
    token: row.token,
    customerName: row.customer_name ?? "",
    usedAt: row.used_at,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

export function hasCatalogBackend() {
  return isSupabaseConfigured && Boolean(supabase);
}

export async function getPublicProducts(): Promise<Product[]> {
  if (!supabase) return fallbackProducts;

  const { data, error } = await supabase
    .from("products")
    .select(productColumns)
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.warn("No se pudo cargar el catalogo desde Supabase. Usando datos locales.", error);
    return fallbackProducts;
  }

  return data?.length ? (data as ProductRow[]).map(rowToProduct) : fallbackProducts;
}

export async function getAdminProducts(): Promise<CatalogProductInput[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select(productColumns)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw error;
  return (data as ProductRow[]).map(rowToInput);
}

export async function saveProduct(product: CatalogProductInput) {
  if (!supabase) throw new Error("Supabase no esta configurado.");

  const payload = inputToRow(product);

  if (product.id) {
    const { error } = await supabase.from("products").update(payload).eq("id", product.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("products").insert(payload);
  if (error) throw error;
}

export async function deleteProduct(id: number) {
  if (!supabase) throw new Error("Supabase no esta configurado.");

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function getPublicGalleryImages(): Promise<GalleryImage[]> {
  if (!supabase) return fallbackGalleryImages;

  const { data, error } = await supabase
    .from("gallery_images")
    .select(galleryColumns)
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.warn("No se pudo cargar la galeria desde Supabase. Usando imagenes locales.", error);
    return fallbackGalleryImages;
  }

  return data?.length ? (data as GalleryImageRow[]).map(galleryRowToImage) : fallbackGalleryImages;
}

export async function getAdminGalleryImages(): Promise<GalleryImageInput[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("gallery_images")
    .select(galleryColumns)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw error;
  return (data as GalleryImageRow[]).map(galleryRowToInput);
}

export async function saveGalleryImage(image: GalleryImageInput) {
  if (!supabase) throw new Error("Supabase no esta configurado.");

  const payload = galleryInputToRow(image);

  if (image.id) {
    const { error } = await supabase.from("gallery_images").update(payload).eq("id", image.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("gallery_images").insert(payload);
  if (error) throw error;
}

export async function deleteGalleryImage(id: number) {
  if (!supabase) throw new Error("Supabase no esta configurado.");

  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) throw error;
}

export async function getPublicInstagramPosts(): Promise<InstagramPost[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("instagram_posts")
    .select(instagramColumns)
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.warn("No se pudo cargar Instagram desde Supabase. Usando solo posts locales.", error);
    return [];
  }

  return data?.length ? (data as InstagramPostRow[]).map(instagramRowToPost) : [];
}

export async function getMergedInstagramPosts(): Promise<InstagramPost[]> {
  const remotePosts = await getPublicInstagramPosts();
  const remoteUrls = new Set(remotePosts.map((post) => post.postUrl.trim()));
  const localPosts = fallbackInstagramPosts.filter((post) => !remoteUrls.has(post.postUrl.trim()));

  return [...remotePosts, ...localPosts];
}

export async function getAdminInstagramPosts(): Promise<InstagramPostInput[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("instagram_posts")
    .select(instagramColumns)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.warn("No se pudo cargar Instagram desde Supabase. Revisa si existe la tabla instagram_posts.", error);
    return [];
  }

  return (data as InstagramPostRow[]).map(instagramRowToInput);
}

export async function saveInstagramPost(post: InstagramPostInput) {
  if (!supabase) throw new Error("Supabase no esta configurado.");

  const payload = instagramInputToRow(post);

  if (post.id) {
    const { error } = await supabase.from("instagram_posts").update(payload).eq("id", post.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("instagram_posts").insert(payload);
  if (error) throw error;
}

export async function deleteInstagramPost(id: number) {
  if (!supabase) throw new Error("Supabase no esta configurado.");

  const { error } = await supabase.from("instagram_posts").delete().eq("id", id);
  if (error) throw error;
}

export async function getPublicReviews(): Promise<CustomerReview[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("customer_reviews")
    .select(reviewColumns)
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: false });

  if (error) {
    console.warn("No se pudieron cargar las reseñas desde Supabase. Usando testimonios locales.", error);
    return [];
  }

  return (data as CustomerReviewRow[]).map(reviewRowToReview);
}

export async function getAdminReviews(): Promise<CustomerReviewInput[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("customer_reviews")
    .select(reviewColumns)
    .order("active", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("id", { ascending: false });

  if (error) {
    console.warn("No se pudieron cargar las reseñas. Revisa si existe la tabla customer_reviews.", error);
    return [];
  }

  return (data as CustomerReviewRow[]).map(reviewRowToInput);
}

export async function saveReview(review: CustomerReviewInput) {
  if (!supabase) throw new Error("Supabase no esta configurado.");

  const payload = reviewInputToRow(review);

  if (review.id) {
    const { error } = await supabase.from("customer_reviews").update(payload).eq("id", review.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("customer_reviews").insert(payload);
  if (error) throw error;
}

export async function submitPublicReview(token: string, review: Omit<CustomerReviewInput, "active" | "sortOrder">) {
  if (!supabase) throw new Error("Supabase no esta configurado.");

  const { error } = await supabase.rpc("submit_customer_review", {
    p_token: token,
    p_customer_name: review.name.trim(),
    p_event_name: review.event.trim(),
    p_review_text: review.text.trim(),
    p_rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
    p_image_url: review.image.trim(),
    p_alt: review.alt.trim(),
  });
  if (error) throw error;
}

export async function deleteReview(id: number) {
  if (!supabase) throw new Error("Supabase no esta configurado.");

  const { error } = await supabase.from("customer_reviews").delete().eq("id", id);
  if (error) throw error;
}

export async function validateReviewInvite(token: string) {
  if (!supabase) throw new Error("Supabase no esta configurado.");

  const { data, error } = await supabase.rpc("validate_review_invite", {
    p_token: token,
  });

  if (error) throw error;
  return Boolean(data);
}

export async function getAdminReviewInvites(): Promise<ReviewInvite[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("customer_review_invites")
    .select(reviewInviteColumns)
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("No se pudieron cargar las invitaciones de reseña.", error);
    return [];
  }

  return (data as ReviewInviteRow[]).map(reviewInviteRowToInvite);
}

export async function createReviewInvite(customerName: string) {
  if (!supabase) throw new Error("Supabase no esta configurado.");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { data, error } = await supabase
    .from("customer_review_invites")
    .insert({
      customer_name: customerName.trim(),
      expires_at: expiresAt.toISOString(),
    })
    .select(reviewInviteColumns)
    .single();

  if (error) throw error;
  return reviewInviteRowToInvite(data as ReviewInviteRow);
}
