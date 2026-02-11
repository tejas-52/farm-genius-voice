import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TranslationProvider } from "@/hooks/useTranslation";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Copilot from "./pages/Copilot";
import Business from "./pages/Business";
import Help from "./pages/Help";
import Sustainability from "./pages/Sustainability";
import Voice from "./pages/Voice";
import Advisory from "./pages/Advisory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TranslationProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/copilot" element={<Copilot />} />
              <Route path="/business" element={<Business />} />
              <Route path="/sustainability" element={<Sustainability />} />
              <Route path="/advisory" element={<Advisory />} />
              <Route path="/voice" element={<Voice />} />
              <Route path="/help" element={<Help />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TranslationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
