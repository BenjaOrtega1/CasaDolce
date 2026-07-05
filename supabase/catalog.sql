create table if not exists public.products (
  id bigserial primary key,
  name text not null,
  description text not null default '',
  category text not null default 'general',
  price_from text not null default '',
  image_url text not null default '',
  alt text not null default '',
  tags text[] not null default '{}',
  active boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id bigserial primary key,
  image_url text not null default '',
  alt text not null default '',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.instagram_posts (
  id bigserial primary key,
  post_url text not null default '',
  image_url text not null default '',
  alt text not null default '',
  caption text not null default '',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_reviews (
  id bigserial primary key,
  invite_id bigint unique,
  customer_name text not null default '',
  event_name text not null default '',
  review_text text not null default '',
  rating integer not null default 5 check (rating between 1 and 5),
  image_url text not null default '',
  alt text not null default '',
  active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_review_invites (
  id bigserial primary key,
  token uuid not null default gen_random_uuid() unique,
  customer_name text not null default '',
  active boolean not null default true,
  used_at timestamptz,
  expires_at timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hero_settings (
  id boolean primary key default true check (id = true),
  image_url text not null default '/instagram/post-02.webp',
  image_alt text not null default 'Torta artesanal Casa Dolce con frutos rojos y crema',
  badge text not null default 'Pasteleria artesanal',
  title text not null default 'Dulzura
artesanal
para
momentos
inolvidables',
  lead text not null default 'Tortas, mesas dulces y detalles personalizados hechos con dedicacion, estetica y sabor.',
  caption_label text not null default 'Especialidad de la casa',
  caption_title text not null default 'Torta artesanal con frutos rojos',
  primary_cta_label text not null default 'Cotizar por WhatsApp',
  whatsapp_message text not null default 'Hola Casa Dolce! Me gustaria cotizar una torta o mesa dulce personalizada.',
  secondary_cta_label text not null default 'Ver catalogo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customer_reviews
add column if not exists invite_id bigint unique references public.customer_review_invites(id) on delete set null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'customer_reviews_invite_id_fkey'
      and conrelid = 'public.customer_reviews'::regclass
  ) then
    alter table public.customer_reviews
    add constraint customer_reviews_invite_id_fkey
    foreign key (invite_id)
    references public.customer_review_invites(id)
    on delete set null;
  end if;
end;
$$;

alter table public.products enable row level security;
alter table public.gallery_images enable row level security;
alter table public.instagram_posts enable row level security;
alter table public.customer_reviews enable row level security;
alter table public.customer_review_invites enable row level security;
alter table public.hero_settings enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
to anon
using (active = true);

drop policy if exists "Authenticated users can read products" on public.products;
create policy "Authenticated users can read products"
on public.products
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert products" on public.products;
create policy "Authenticated users can insert products"
on public.products
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update products" on public.products;
create policy "Authenticated users can update products"
on public.products
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete products" on public.products;
create policy "Authenticated users can delete products"
on public.products
for delete
to authenticated
using (true);

drop policy if exists "Public can read active gallery images" on public.gallery_images;
create policy "Public can read active gallery images"
on public.gallery_images
for select
to anon
using (active = true);

drop policy if exists "Authenticated users can read gallery images" on public.gallery_images;
create policy "Authenticated users can read gallery images"
on public.gallery_images
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert gallery images" on public.gallery_images;
create policy "Authenticated users can insert gallery images"
on public.gallery_images
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update gallery images" on public.gallery_images;
create policy "Authenticated users can update gallery images"
on public.gallery_images
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete gallery images" on public.gallery_images;
create policy "Authenticated users can delete gallery images"
on public.gallery_images
for delete
to authenticated
using (true);

drop policy if exists "Public can read active instagram posts" on public.instagram_posts;
create policy "Public can read active instagram posts"
on public.instagram_posts
for select
to anon
using (active = true);

drop policy if exists "Authenticated users can read instagram posts" on public.instagram_posts;
create policy "Authenticated users can read instagram posts"
on public.instagram_posts
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert instagram posts" on public.instagram_posts;
create policy "Authenticated users can insert instagram posts"
on public.instagram_posts
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update instagram posts" on public.instagram_posts;
create policy "Authenticated users can update instagram posts"
on public.instagram_posts
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete instagram posts" on public.instagram_posts;
create policy "Authenticated users can delete instagram posts"
on public.instagram_posts
for delete
to authenticated
using (true);

drop policy if exists "Public can read active customer reviews" on public.customer_reviews;
create policy "Public can read active customer reviews"
on public.customer_reviews
for select
to anon
using (active = true);

drop policy if exists "Public can submit customer reviews" on public.customer_reviews;

drop policy if exists "Authenticated users can read customer reviews" on public.customer_reviews;
create policy "Authenticated users can read customer reviews"
on public.customer_reviews
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert customer reviews" on public.customer_reviews;
create policy "Authenticated users can insert customer reviews"
on public.customer_reviews
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update customer reviews" on public.customer_reviews;
create policy "Authenticated users can update customer reviews"
on public.customer_reviews
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete customer reviews" on public.customer_reviews;
create policy "Authenticated users can delete customer reviews"
on public.customer_reviews
for delete
to authenticated
using (true);

drop policy if exists "Authenticated users can read review invites" on public.customer_review_invites;
drop policy if exists "Public can read valid review invites" on public.customer_review_invites;
create policy "Public can read valid review invites"
on public.customer_review_invites
for select
to anon
using (
  active = true
  and used_at is null
  and (expires_at is null or expires_at > now())
);

create policy "Authenticated users can read review invites"
on public.customer_review_invites
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert review invites" on public.customer_review_invites;
create policy "Authenticated users can insert review invites"
on public.customer_review_invites
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update review invites" on public.customer_review_invites;
create policy "Authenticated users can update review invites"
on public.customer_review_invites
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete review invites" on public.customer_review_invites;
create policy "Authenticated users can delete review invites"
on public.customer_review_invites
for delete
to authenticated
using (true);

drop policy if exists "Public can read hero settings" on public.hero_settings;
create policy "Public can read hero settings"
on public.hero_settings
for select
to anon
using (true);

drop policy if exists "Authenticated users can read hero settings" on public.hero_settings;
create policy "Authenticated users can read hero settings"
on public.hero_settings
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert hero settings" on public.hero_settings;
create policy "Authenticated users can insert hero settings"
on public.hero_settings
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update hero settings" on public.hero_settings;
create policy "Authenticated users can update hero settings"
on public.hero_settings
for update
to authenticated
using (true)
with check (true);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

drop trigger if exists gallery_images_set_updated_at on public.gallery_images;
create trigger gallery_images_set_updated_at
before update on public.gallery_images
for each row
execute function public.set_updated_at();

drop trigger if exists instagram_posts_set_updated_at on public.instagram_posts;
create trigger instagram_posts_set_updated_at
before update on public.instagram_posts
for each row
execute function public.set_updated_at();

drop trigger if exists customer_reviews_set_updated_at on public.customer_reviews;
create trigger customer_reviews_set_updated_at
before update on public.customer_reviews
for each row
execute function public.set_updated_at();

drop trigger if exists customer_review_invites_set_updated_at on public.customer_review_invites;
create trigger customer_review_invites_set_updated_at
before update on public.customer_review_invites
for each row
execute function public.set_updated_at();

drop trigger if exists hero_settings_set_updated_at on public.hero_settings;
create trigger hero_settings_set_updated_at
before update on public.hero_settings
for each row
execute function public.set_updated_at();

insert into public.hero_settings (id)
values (true)
on conflict (id) do nothing;

create or replace function public.validate_review_invite(p_token uuid)
returns boolean
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.customer_review_invites
    where token = p_token
      and active = true
      and used_at is null
      and (expires_at is null or expires_at > now())
  );
end;
$$ language plpgsql;

create or replace function public.submit_customer_review(
  p_token uuid,
  p_customer_name text,
  p_event_name text,
  p_review_text text,
  p_rating integer,
  p_image_url text,
  p_alt text
)
returns void
security definer
set search_path = public
as $$
declare
  v_invite_id bigint;
begin
  update public.customer_review_invites
  set used_at = now()
  where token = p_token
    and active = true
    and used_at is null
    and (expires_at is null or expires_at > now())
  returning id into v_invite_id;

  if v_invite_id is null then
    raise exception 'Este link de reseña ya fue usado, venció o no es válido.';
  end if;

  insert into public.customer_reviews (
    invite_id,
    customer_name,
    event_name,
    review_text,
    rating,
    image_url,
    alt,
    active,
    sort_order
  )
  values (
    v_invite_id,
    trim(p_customer_name),
    trim(coalesce(p_event_name, 'Pedido Casa Dolce')),
    trim(p_review_text),
    least(5, greatest(1, coalesce(p_rating, 5))),
    trim(coalesce(p_image_url, '')),
    case
      when trim(coalesce(p_image_url, '')) = '' then ''
      else trim(coalesce(p_alt, 'Foto de pedido Casa Dolce'))
    end,
    false,
    0
  );
end;
$$ language plpgsql;

grant execute on function public.validate_review_invite(uuid) to anon, authenticated;
grant execute on function public.submit_customer_review(uuid, text, text, text, integer, text, text) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'hero-images',
  'hero-images',
  true,
  5242880,
  array['image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery-images',
  'gallery-images',
  true,
  5242880,
  array['image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'instagram-posts',
  'instagram-posts',
  true,
  5242880,
  array['image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'review-images',
  'review-images',
  true,
  5242880,
  array['image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read hero images" on storage.objects;
create policy "Public can read hero images"
on storage.objects
for select
to public
using (bucket_id = 'hero-images');

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects
for select
to public
using (bucket_id = 'product-images');

drop policy if exists "Public can read gallery images files" on storage.objects;
create policy "Public can read gallery images files"
on storage.objects
for select
to public
using (bucket_id = 'gallery-images');

drop policy if exists "Public can read instagram post images" on storage.objects;
create policy "Public can read instagram post images"
on storage.objects
for select
to public
using (bucket_id = 'instagram-posts');

drop policy if exists "Public can read review images" on storage.objects;
create policy "Public can read review images"
on storage.objects
for select
to public
using (bucket_id = 'review-images');

drop policy if exists "Authenticated users can upload hero images" on storage.objects;
create policy "Authenticated users can upload hero images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'hero-images');

drop policy if exists "Authenticated users can upload product images" on storage.objects;
create policy "Authenticated users can upload product images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images');

drop policy if exists "Authenticated users can upload gallery images files" on storage.objects;
create policy "Authenticated users can upload gallery images files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'gallery-images');

drop policy if exists "Authenticated users can upload instagram post images" on storage.objects;
create policy "Authenticated users can upload instagram post images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'instagram-posts');

drop policy if exists "Public can upload review images" on storage.objects;
create policy "Public can upload review images"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'review-images'
  and exists (
    select 1
    from public.customer_review_invites
    where token::text = (storage.foldername(name))[1]
      and active = true
      and used_at is null
      and (expires_at is null or expires_at > now())
  )
);

drop policy if exists "Authenticated users can upload review images" on storage.objects;
create policy "Authenticated users can upload review images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'review-images');

drop policy if exists "Authenticated users can update product images" on storage.objects;
drop policy if exists "Authenticated users can update hero images" on storage.objects;
create policy "Authenticated users can update hero images"
on storage.objects
for update
to authenticated
using (bucket_id = 'hero-images')
with check (bucket_id = 'hero-images');

drop policy if exists "Authenticated users can update product images" on storage.objects;
create policy "Authenticated users can update product images"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

drop policy if exists "Authenticated users can update gallery images files" on storage.objects;
create policy "Authenticated users can update gallery images files"
on storage.objects
for update
to authenticated
using (bucket_id = 'gallery-images')
with check (bucket_id = 'gallery-images');

drop policy if exists "Authenticated users can update instagram post images" on storage.objects;
create policy "Authenticated users can update instagram post images"
on storage.objects
for update
to authenticated
using (bucket_id = 'instagram-posts')
with check (bucket_id = 'instagram-posts');

drop policy if exists "Authenticated users can update review images" on storage.objects;
create policy "Authenticated users can update review images"
on storage.objects
for update
to authenticated
using (bucket_id = 'review-images')
with check (bucket_id = 'review-images');

drop policy if exists "Authenticated users can delete product images" on storage.objects;
drop policy if exists "Authenticated users can delete hero images" on storage.objects;
create policy "Authenticated users can delete hero images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'hero-images');

drop policy if exists "Authenticated users can delete product images" on storage.objects;
create policy "Authenticated users can delete product images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images');

drop policy if exists "Authenticated users can delete gallery images files" on storage.objects;
create policy "Authenticated users can delete gallery images files"
on storage.objects
for delete
to authenticated
using (bucket_id = 'gallery-images');

drop policy if exists "Authenticated users can delete instagram post images" on storage.objects;
create policy "Authenticated users can delete instagram post images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'instagram-posts');

drop policy if exists "Authenticated users can delete review images" on storage.objects;
create policy "Authenticated users can delete review images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'review-images');
