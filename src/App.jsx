import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductsProvider } from '@/modules/products/infrastructure/products-provider';
import { CartProvider } from '@/modules/cart/infrastructure/cart-provider';
import { HomePage } from '@/pages/HomePage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { Header } from '@/modules/shared/ui/header';

function App() {
  return (
    <BrowserRouter>
      <ProductsProvider>
        <CartProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
            </Routes>
          </div>
        </CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  );
}

export default App;
