export const siteConfig = {
  name: "Casa Dolce",
  tagline: "Pastelería artesanal a medida",
  description:
    "Catálogo de pastelería artesanal premium con tortas, cupcakes, galletas y boxes dulces para cotizar por WhatsApp.",
  whatsappNumber: "5491112345678",
  whatsappDisplay: "+54 9 11 1234-5678",
  email: "hola@casadolce.com",
  location: "Palermo, Buenos Aires, Argentina",
  instagramHandle: "@_casa.dolce_",
  instagramUrl: "https://www.instagram.com/_casa.dolce_/",
  social: {
    instagram: "https://www.instagram.com/_casa.dolce_/",
    facebook: "#",
  },
  brand: {
    heroKicker: "Pastelería artesanal",
    heroTitle: "Casa Dolce",
    heroLead:
      "Tortas personalizadas, cupcakes y postres artesanales pensados para celebrar con elegancia, detalle y sabor real.",
  },
};

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
