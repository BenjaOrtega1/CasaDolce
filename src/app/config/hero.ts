export interface HeroSettings {
  image: string;
  imageAlt: string;
  badge: string;
  title: string;
  lead: string;
  captionLabel: string;
  captionTitle: string;
  primaryCtaLabel: string;
  whatsappMessage: string;
  secondaryCtaLabel: string;
}

export const defaultHeroSettings: HeroSettings = {
  image: "/instagram/post-02.webp",
  imageAlt: "Torta artesanal Casa Dolce con frutos rojos y crema",
  badge: "Pasteleria artesanal",
  title: "Dulzura\nartesanal\npara\nmomentos\ninolvidables",
  lead: "Tortas, mesas dulces y detalles personalizados hechos con dedicacion, estetica y sabor.",
  captionLabel: "Especialidad de la casa",
  captionTitle: "Torta artesanal con frutos rojos",
  primaryCtaLabel: "Cotizar por WhatsApp",
  whatsappMessage: "Hola Casa Dolce! Me gustaria cotizar una torta o mesa dulce personalizada.",
  secondaryCtaLabel: "Ver catalogo",
};
