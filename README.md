# Monster — Official Personal Portfolio

Monster is my official personal portfolio — a single-page interactive experience that showcases my work, my process, and the team I collaborate with. This site blends modern UI, high-quality animations, and robust front-end engineering: 3D article cards, a filterable gallery, canvas-powered hover effects, Swiper carousels, Lottie illustrations, and GSAP scroll-driven animations.

## Screenshots
![Desktop Screenshot](./assets/images/Gallrey/mode/monster-full-red.jpg)

## Demo 
https://monster-az.netlify.app/

## What the site includes
- Header with anchor links to sections (single-page navigation)  
- Hero section: short intro about me (front-end dev) + CTA buttons (Contact / View Projects) and animated portrait (CSS & Canvas)  
- Articles: 8 interactive 3D cards (flip to read more) — each card contains a short summary and topic (HTML, CSS, JS, architecture, tips)  
- Gallery: 8 projects with hover canvas effects, short descriptions, demo links, tech used & completion date  
- Features: three highlight cards (Time, Passion, Quality) with advanced CSS/JS effects  
- Testimonials: Swiper.js carousel with custom behaviors  
- Team Members: team section with CSS & JS effects (placeholder images for now)  
- Skills: animated skills visualization with Lottie & CSS/JS effects  
- Services: six service offerings presented with creative CSS & JS-driven interactions (clip-path, layered animations)  
- How It Works: Lottie-supported steps + three cards (Business analysis, Architecture, Development)  
- Latest Events: countdown timer to a specific date with visual styling  
- Top Projects: vertical Y-axis carousel (touch + wheel support) showcasing top projects/screenshots  
- Request: interactive request box with multi-step transition and animated flow  
- Footer: animated background (vanilla JS) + social links (LinkedIn, GitHub, Instagram), contact & location, Lottie element  
- Color-mode panel: sidebar toggles 5 color themes stored in localStorage (persist across visits)  
- Fully responsive from 340px up to 1440px

## Built With
- HTML5, CSS3 (modular under `assets/css/`)  
- JavaScript (Vanilla) — modular architecture under `assets/js/modules/`  
- Swiper.js (carousels)  
- Lottie (animated illustrations)  
- GSAP (scroll-driven animations)  
- Canvas API for hover/visual effects  
- Font Awesome for icons

## What I learned building Monster
**Frontend architecture & maintainability**
- Modular CSS organization (base, components, layout, sections) for scalability.  
- CSS variables and theme patterns to control multi-theme color modes.  
- Strategies for responsive design: mobile-first, flexible breakpoints, and fluid images.

**Advanced JS & performance**
- Designing JS modules for widgets (carousel, gallery filter, card flip) and coordinating init order.  
- Building performant canvas effects (optimized draw loops, requestAnimationFrame) and combining them with DOM updates.  
- Integrating GSAP scroll triggers while avoiding layout thrashing and keeping smooth 60fps experience.

**Animations & UX**
- Using Lottie for lightweight, scalable animations and GSAP for complex timeline/scroll-based interactions.  
- Creating 3D transform card flips, vertical carousels, and multi-step UI flows without heavy frameworks.

**Accessibility & semantics**
- Emphasis on semantic HTML, ARIA attributes for better screen-reader experience and keyboard navigation for interactive widgets.

**Deployment & workflow**
- Clean commit history (Conventional Commits), documentation, and GitHub Pages deployment readiness.  
- Image optimization with srcset, lazy loading, and splitting critical CSS to speed up first paint.

## How To Run Locally
```bash
git clone https://github.com/Abdalrahman-Zatary/monster-personal-site.git
cd monster-personal-site
open index.html  