
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProgressProvider } from "@/context/ProgressContext";
import Index from "./pages/Index";
import Introduction from "./pages/Introduction";
import Installation from "./pages/Installation";
import Models from "./pages/Models";
import Serializers from "./pages/Serializers";
import Views from "./pages/Views";
import Routers from "./pages/Routers";
import Authentication from "./pages/Authentication";
import Permissions from "./pages/Permissions";
import ViewSets from "./pages/ViewSets";
import Filtering from "./pages/Filtering";
import Testing from "./pages/Testing";
import Integration from "./pages/Integration";
import Practice from "./pages/Practice";
import Interview from "./pages/Interview";
import Advanced from "./pages/Advanced";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProgressProvider totalItems={30}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/introduction" element={<Introduction />} />
            <Route path="/installation" element={<Installation />} />
            <Route path="/models" element={<Models />} />
            <Route path="/serializers" element={<Serializers />} />
            <Route path="/views" element={<Views />} />
            <Route path="/routers" element={<Routers />} />
            <Route path="/authentication" element={<Authentication />} />
            <Route path="/permissions" element={<Permissions />} />
            <Route path="/viewsets" element={<ViewSets />} />
            <Route path="/filtering" element={<Filtering />} />
            <Route path="/testing" element={<Testing />} />
            <Route path="/integration" element={<Integration />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/advanced" element={<Advanced />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
