/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { FloatingGuides } from "./components/FloatingGuides";
import { FloatingMascot } from "./components/FloatingMascot";
import { GuidesStrip } from "./components/GuidesStrip";
import { Home } from "./pages/Home";
import { CategoryPage } from "./pages/CategoryPage";
import { ArticlePage } from "./pages/ArticlePage";
import { AuthorsPage } from "./pages/AuthorsPage";
import { GuidePage } from "./pages/GuidePage";
import { GuidesIndexPage } from "./pages/GuidesIndexPage";
import { AuthProvider } from "./context/AuthContext";
import { GamificationProvider } from "./context/GamificationContext";
import { ThemeProvider } from "./components/theme-provider";

import { ProfilePage } from "./pages/ProfilePage";
import { BlogPage } from "./pages/BlogPage";

import { useParams } from "react-router-dom";
import { CATEGORIES_DATA } from "./data/categories";

function GuiasResolver() {
  const { category, subcategoryOrSlug } = useParams<{ category: string; subcategoryOrSlug: string }>();
  
  const isSubcategory = CATEGORIES_DATA.some(c => 
    c.id === category?.replace(/-/g, '_') && 
    c.subcategories.some(s => s.id === subcategoryOrSlug?.replace(/-/g, '_'))
  );
  
  if (isSubcategory) {
    return <GuidePage overrideSubcategory={subcategoryOrSlug} />;
  } else {
    return <ArticlePage overrideSlug={subcategoryOrSlug} />;
  }
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <GamificationProvider>
          <Router>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <GuidesStrip />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/filosofia" element={<CategoryPage category="filosofia" />} />
                  <Route path="/literatura" element={<CategoryPage category="literatura" />} />
                  <Route path="/guias" element={<GuidesIndexPage />} />
                  <Route path="/guias/:category/:subcategory/:slug" element={<ArticlePage />} />
                  <Route path="/guias/:category/:subcategoryOrSlug" element={<GuiasResolver />} />
                  <Route path="/guias/:category" element={<GuidePage />} />
                  <Route path="/autores" element={<AuthorsPage />} />
                  <Route path="/bitacora" element={<BlogPage />} />
                  <Route path="/articulos/:slug" element={<ArticlePage />} />
                  <Route path="/perfil" element={<ProfilePage />} />
                </Routes>
              </main>
              <Footer />
              <FloatingMascot />
              <FloatingGuides />
            </div>
          </Router>
        </GamificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
