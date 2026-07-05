import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { CheckCircle, MessageCircle, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { buildWhatsAppUrl, siteConfig } from "../config/site";

interface FormData {
  name: string;
  phone: string;
  product: string;
  quantity: string;
  date: string;
  message: string;
}

const initialForm: FormData = {
  name: "",
  phone: "",
  product: "",
  quantity: "",
  date: "",
  message: "",
};

export function QuoteForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = Boolean(form.name.trim() && form.product);

  const buildWhatsAppMessage = () => {
    const lines = [
      `Hola ${siteConfig.name}! Me gustaría solicitar una cotización:`,
      "",
      `Nombre: ${form.name}`,
      form.phone ? `Celular: ${form.phone}` : null,
      `Producto: ${form.product}`,
      form.quantity ? `Cantidad / porciones: ${form.quantity}` : null,
      form.date ? `Fecha requerida: ${form.date}` : null,
      form.message ? `Detalles: ${form.message}` : null,
    ];

    return lines.filter(Boolean).join("\n");
  };

  const openWhatsApp = () => {
    if (!isValid) {
      setTouched(true);
      return;
    }
    window.open(buildWhatsAppUrl(buildWhatsAppMessage()), "_blank", "noopener,noreferrer");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    openWhatsApp();
    if (!isValid) return;
    setSent(true);
    window.setTimeout(() => {
      setSent(false);
      setForm(initialForm);
      setTouched(false);
    }, 4000);
  };

  return (
    <section id="cotizar" className="section-shell section-shell--quote">
      <div className="section-inner section-inner--narrow">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="section-heading"
        >
          <p className="section-kicker">
            <MessageCircle className="size-4" aria-hidden="true" />
            Solicitar cotización
          </p>
          <h2>Cuéntanos tu idea</h2>
          <p>
            Completa lo esencial y abriremos WhatsApp con el mensaje listo.
            Después podemos ajustar sabores, porciones y terminaciones.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="quote-card"
        >
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="quote-success"
            >
              <CheckCircle className="size-14" aria-hidden="true" />
              <h3>Mensaje preparado</h3>
              <p>Te redirigimos a WhatsApp. Casa Dolce responderá tu cotización lo antes posible.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="field-group">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    required
                    placeholder="Tu nombre completo"
                    value={form.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                    aria-invalid={touched && !form.name.trim()}
                  />
                </div>
                <div className="field-group">
                  <Label htmlFor="phone">Celular</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+56 9 XXXX XXXX"
                    value={form.phone}
                    onChange={(event) => handleChange("phone", event.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="field-group">
                  <Label htmlFor="product">Producto *</Label>
                  <Select value={form.product} onValueChange={(value) => handleChange("product", value)}>
                    <SelectTrigger id="product" aria-invalid={touched && !form.product}>
                      <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Torta Personalizada">Torta Personalizada</SelectItem>
                      <SelectItem value="Cupcakes">Cupcakes</SelectItem>
                      <SelectItem value="Galletas Decoradas">Galletas Decoradas</SelectItem>
                      <SelectItem value="Box Dulce">Box Dulce</SelectItem>
                      <SelectItem value="Postres Individuales">Postres Individuales</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="field-group">
                  <Label htmlFor="quantity">Cantidad / porciones</Label>
                  <Input
                    id="quantity"
                    placeholder="Ej: 20 porciones"
                    value={form.quantity}
                    onChange={(event) => handleChange("quantity", event.target.value)}
                  />
                </div>
              </div>

              <div className="field-group">
                <Label htmlFor="date">Fecha del evento</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(event) => handleChange("date", event.target.value)}
                />
              </div>

              <div className="field-group">
                <Label htmlFor="message">Idea o mensaje personalizado</Label>
                <Textarea
                  id="message"
                  rows={4}
                  placeholder="Colores, temática, sabores, referencias o detalles importantes..."
                  value={form.message}
                  onChange={(event) => handleChange("message", event.target.value)}
                />
              </div>

              {touched && !isValid ? (
                <p className="form-error" role="alert">
                  Completa al menos tu nombre y el producto para preparar la cotización.
                </p>
              ) : null}

              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <Button type="submit" className="btn-whatsapp h-12 flex-1 text-base">
                  <MessageCircle className="size-5" aria-hidden="true" />
                  Enviar por WhatsApp
                </Button>
                <Button type="button" variant="outline" className="btn-secondary h-12 px-6" onClick={openWhatsApp}>
                  <Send className="size-4" aria-hidden="true" />
                  Solo abrir
                </Button>
              </div>

              <p className="form-note">
                Al enviar se abrirá WhatsApp con el mensaje listo. No guardamos tus datos en el sitio.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
