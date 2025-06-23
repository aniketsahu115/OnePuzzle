import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import Dashboard from "@/pages/Dashboard";
import Learn from "@/pages/Learn";
import Resources from "@/pages/Resources";
import { WalletProvider } from "./lib/useWallet";
import { ThemeProvider } from "./lib/useTheme";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/learn" component={Learn} />
      <Route path="/resources" component={Resources} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WalletProvider>
          <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <NavBar />
            <div className="flex-grow">
              <Router />
            </div>
            <Footer />
          </div>
          <Toaster />
        </WalletProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
