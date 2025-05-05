import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add Font Awesome for icons
const fontAwesomeLink = document.createElement("link");
fontAwesomeLink.rel = "stylesheet";
fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
document.head.appendChild(fontAwesomeLink);

// Add Google Fonts
const googleFontsLink = document.createElement("link");
googleFontsLink.rel = "stylesheet";
googleFontsLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&display=swap";
document.head.appendChild(googleFontsLink);

// Set page title
document.title = "BookBuddy - Find Your Next Great Read";

createRoot(document.getElementById("root")!).render(<App />);
