import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Setup theme colors for consistency with design reference
document.documentElement.style.setProperty('--background', '240 100% 99%');
document.documentElement.style.setProperty('--foreground', '222.2 47.4% 11.2%');
document.documentElement.style.setProperty('--card', '0 0% 100%');
document.documentElement.style.setProperty('--card-foreground', '222.2 47.4% 11.2%');
document.documentElement.style.setProperty('--popover', '0 0% 100%');
document.documentElement.style.setProperty('--popover-foreground', '222.2 47.4% 11.2%');
document.documentElement.style.setProperty('--primary', '222.2 47.4% 11.2%');
document.documentElement.style.setProperty('--primary-foreground', '210 40% 98%');
document.documentElement.style.setProperty('--secondary', '210 40% 96.1%');
document.documentElement.style.setProperty('--secondary-foreground', '222.2 47.4% 11.2%');
document.documentElement.style.setProperty('--muted', '210 40% 96.1%');
document.documentElement.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%');
document.documentElement.style.setProperty('--accent', '31.8 81.2% 54.9%');
document.documentElement.style.setProperty('--accent-foreground', '222.2 47.4% 11.2%');
document.documentElement.style.setProperty('--destructive', '0 84.2% 60.2%');
document.documentElement.style.setProperty('--destructive-foreground', '210 40% 98%');
document.documentElement.style.setProperty('--border', '214.3 31.8% 91.4%');
document.documentElement.style.setProperty('--input', '214.3 31.8% 91.4%');
document.documentElement.style.setProperty('--ring', '222.2 47.4% 11.2%');
document.documentElement.style.setProperty('--radius', '0.5rem');

createRoot(document.getElementById("root")!).render(<App />);
