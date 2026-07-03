insert into public.products
  (name, description, category, price_from, image_url, alt, tags, active, featured, sort_order)
values
  (
    'Tortas Personalizadas',
    'Tortas únicas diseñadas especialmente para tu evento. Pisos personalizados con decoración artesanal, flores de azúcar y acabados de lujo.',
    'tortas',
    'desde $8.000',
    'https://images.unsplash.com/photo-1565853457079-562afb49d09f?w=900&h=700&fit=crop&auto=format&q=82',
    'Torta con rosas de vainilla decorada artesanalmente',
    array['Personalizada', 'Artesanal', 'Eventos'],
    true,
    true,
    10
  ),
  (
    'Cupcakes',
    'Mini tortas individuales con frosting artesanal en manga. Perfectas para cumpleaños, baby showers y cualquier celebración especial.',
    'cupcakes',
    'desde $350 c/u',
    'https://images.unsplash.com/photo-1586985290301-8db40143d525?w=900&h=700&fit=crop&auto=format&q=82',
    'Cupcake con frosting rosa artesanal',
    array['Individuales', 'Frosting', 'Sin TACC'],
    true,
    false,
    20
  ),
  (
    'Galletas Decoradas',
    'Galletas artesanales con diseños únicos en glasé real y pintura comestible. Ideales para souvenirs, regalos y fechas especiales.',
    'galletas',
    'desde $280 c/u',
    'https://images.unsplash.com/photo-1568678898762-47a72e9614b6?w=900&h=700&fit=crop&auto=format&q=82',
    'Galletas decoradas con flores y glasé real',
    array['Souvenir', 'Glasé real', 'Personalizadas'],
    true,
    false,
    30
  ),
  (
    'Boxes Dulces',
    'Cajas regalo con surtido de dulces artesanales, macarons, trufas y delicias seleccionadas. Una experiencia completa para regalar.',
    'boxes',
    'desde $2.500',
    'https://images.unsplash.com/photo-1771333297902-1a05063aec2e?w=900&h=700&fit=crop&auto=format&q=82',
    'Box con macarons coloridos y dulces artesanales',
    array['Regalo', 'Macarons', 'Premium'],
    true,
    false,
    40
  ),
  (
    'Postres Individuales',
    'Macarons, mini tartas, verrines y postres gourmet individuales. Elegancia en cada bocado para tus eventos más sofisticados.',
    'postres',
    'desde $450 c/u',
    'https://images.unsplash.com/photo-1706188458145-f11cb33aa1a0?w=900&h=700&fit=crop&auto=format&q=82',
    'Torta blanca elegante con flores para postres individuales',
    array['Gourmet', 'Mini porción', 'Eventos'],
    true,
    false,
    50
  );
