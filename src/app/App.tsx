import { lazy, Suspense, useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Catalog } from "./components/Catalog";
import { HowItWorks } from "./components/HowItWorks";
import { Gallery } from "./components/Gallery";
import { InstagramFeed } from "./components/InstagramFeed";
import { Testimonials } from "./components/Testimonials";
import { QuoteForm } from "./components/QuoteForm";
import { Footer } from "./components/Footer";
import { ScrollProgress } from "./components/ScrollProgress";
import { AppDialogProvider } from "./components/AppDialog";

const AdminCatalog = lazy(() =>
  import("./components/AdminCatalog").then((module) => ({ default: module.AdminCatalog })),
);

const ReviewForm = lazy(() =>
  import("./components/ReviewForm").then((module) => ({ default: module.ReviewForm })),
);

/* MARKER-MAKE-KIT-INVOKED */
export default function App() {
  const [route, setRoute] = useState(() => window.location.hash);

  useEffect(() => {
    const updateRoute = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  let content;

  if (route === "#admin") {
    content = (
      <Suspense fallback={<div className="admin-page">Cargando administración...</div>}>
        <AdminCatalog />
      </Suspense>
    );
  } else if (route.startsWith("#resena")) {
    content = (
      <Suspense fallback={<div className="review-page">Cargando formulario de reseña...</div>}>
        <ReviewForm />
      </Suspense>
    );
  } else {
    content = (
      <div className="min-h-screen bg-background">
        <ScrollProgress />
        <Header />
        <main>
          <Hero />
          <Catalog />
          <HowItWorks />
          <Gallery />
          <InstagramFeed />
          <Testimonials />
          <QuoteForm />
        </main>
        <Footer />
      </div>
    );
  }

  return <AppDialogProvider>{content}</AppDialogProvider>;
}
