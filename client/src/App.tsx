import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";

export default function App() {
  return (
    // Captura erros inesperados sem derrubar toda a interface.
    <ErrorBoundary>
      {/* Disponibiliza tooltips e notificações para os componentes filhos. */}
      <TooltipProvider>
        <Toaster position="bottom-right" richColors />
        <Home />
      </TooltipProvider>
    </ErrorBoundary>
  );
}
