export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  priceFrom: string;
  image: string;
  alt: string;
  tags: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Tortas Personalizadas",
    description:
      "Tortas únicas diseñadas especialmente para tu evento. Pisos personalizados con decoración artesanal, flores de azúcar y acabados de lujo.",
    category: "tortas",
    priceFrom: "desde $8.000",
    image: "https://images.unsplash.com/photo-1565853457079-562afb49d09f?w=900&h=700&fit=crop&auto=format&q=82",
    alt: "Torta con rosas de vainilla decorada artesanalmente",
    tags: ["Personalizada", "Artesanal", "Eventos"],
  },
  {
    id: 2,
    name: "Cupcakes",
    description:
      "Mini tortas individuales con frosting artesanal en manga. Perfectas para cumpleaños, baby showers y cualquier celebración especial.",
    category: "cupcakes",
    priceFrom: "desde $350 c/u",
    image: "https://images.unsplash.com/photo-1586985290301-8db40143d525?w=900&h=700&fit=crop&auto=format&q=82",
    alt: "Cupcake con frosting rosa artesanal",
    tags: ["Individuales", "Frosting", "Sin TACC"],
  },
  {
    id: 3,
    name: "Galletas Decoradas",
    description:
      "Galletas artesanales con diseños únicos en glasé real y pintura comestible. Ideales para souvenirs, regalos y fechas especiales.",
    category: "galletas",
    priceFrom: "desde $280 c/u",
    image: "https://images.unsplash.com/photo-1568678898762-47a72e9614b6?w=900&h=700&fit=crop&auto=format&q=82",
    alt: "Galletas decoradas con flores y glasé real",
    tags: ["Souvenir", "Glasé real", "Personalizadas"],
  },
  {
    id: 4,
    name: "Boxes Dulces",
    description:
      "Cajas regalo con surtido de dulces artesanales, macarons, trufas y delicias seleccionadas. Una experiencia completa para regalar.",
    category: "boxes",
    priceFrom: "desde $2.500",
    image: "https://images.unsplash.com/photo-1771333297902-1a05063aec2e?w=900&h=700&fit=crop&auto=format&q=82",
    alt: "Box con macarons coloridos y dulces artesanales",
    tags: ["Regalo", "Macarons", "Premium"],
  },
  {
    id: 5,
    name: "Postres Individuales",
    description:
      "Macarons, mini tartas, verrines y postres gourmet individuales. Elegancia en cada bocado para tus eventos más sofisticados.",
    category: "postres",
    priceFrom: "desde $450 c/u",
    image: "https://images.unsplash.com/photo-1706188458145-f11cb33aa1a0?w=900&h=700&fit=crop&auto=format&q=82",
    alt: "Torta blanca elegante con flores para postres individuales",
    tags: ["Gourmet", "Mini porción", "Eventos"],
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Valentina Moreno",
    event: "Cumpleaños de 15 años",
    text: "La torta fue absolutamente impresionante. Mis invitados no podían creer que fuera comestible. El sabor, la decoración y la presentación fueron perfectos.",
    rating: 5,
    initials: "VM",
    color: "#F9CDD5",
  },
  {
    id: 2,
    name: "Camila y Rodrigo",
    event: "Matrimonio",
    text: "Encargamos la torta de 4 pisos para nuestro matrimonio y fue el centro de atención de la noche. Los cupcakes para los invitados también estuvieron deliciosos.",
    rating: 5,
    initials: "CR",
    color: "#FDE8D8",
  },
  {
    id: 3,
    name: "Sofía Ramírez",
    event: "Baby shower",
    text: "Las galletas decoradas quedaron increíbles. Cada una era una obra de arte y los sabores, divinos. Todos me preguntaron dónde las había conseguido.",
    rating: 5,
    initials: "SR",
    color: "#F5EAE0",
  },
  {
    id: 4,
    name: "Luciana Gómez",
    event: "Cumpleaños corporativo",
    text: "Encargué los boxes dulces para un evento corporativo y fueron un éxito total. La presentación es de primer nivel y el sabor no se queda atrás.",
    rating: 5,
    initials: "LG",
    color: "#FFF0F5",
  },
];

export const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1736959574670-a8ace9856e1c?w=700&h=900&fit=crop&auto=format&q=82",
    alt: "Torta rosa con decoración de flamenco",
    span: "tall",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1561702856-b4ec96854ed8?w=700&h=560&fit=crop&auto=format&q=82",
    alt: "Torta de tres pisos elegante",
    span: "normal",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=700&h=560&fit=crop&auto=format&q=82",
    alt: "Cupcakes con frosting de colores",
    span: "normal",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1565853457079-562afb49d09f?w=700&h=900&fit=crop&auto=format&q=82",
    alt: "Torta con rosas de vainilla",
    span: "tall",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1568678898762-47a72e9614b6?w=700&h=560&fit=crop&auto=format&q=82",
    alt: "Galletas decoradas con flores",
    span: "normal",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1771333297902-1a05063aec2e?w=700&h=620&fit=crop&auto=format&q=82",
    alt: "Box de macarons coloridos",
    span: "normal",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1706188458145-f11cb33aa1a0?w=700&h=900&fit=crop&auto=format&q=82",
    alt: "Torta blanca con flores",
    span: "tall",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1586985290301-8db40143d525?w=700&h=560&fit=crop&auto=format&q=82",
    alt: "Cupcake rosa individual",
    span: "normal",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1765692799769-a5d4924921fc?w=700&h=560&fit=crop&auto=format&q=82",
    alt: "Interior de pastelería con tonos pastel",
    span: "normal",
  },
];
