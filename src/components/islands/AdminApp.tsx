import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import AdminPage from "@/components/admin/AdminPage";

const queryClient = new QueryClient();

/** Painel administrativo (SPA, só no navegador, fora do índice do Google). */
export default function AdminApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
