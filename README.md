# Karma Foundation — Website 

## 🚀 Quick Start / How to Run

### Option 1: Open Directly in Browser
Double-click index.html or right-click and open with your preferred browser (Google Chrome, Edge, Safari, Firefox).

### Option 2: Run with Local HTTP Server (Recommended)
Open a terminal in this directory and run:

`ash
# Using Python
python -m http.server 8000

# OR using Node.js / npx
npx serve .
`

Then visit [http://localhost:8000](http://localhost:8000) in your browser.

---

## 📁 Project Structure

`
karma-foundation-clone/
├── index.html            # Homepage (Hero, Stats counter, Initiatives, About, Partners, Testimonials)
├── about.html            # About Us (Story, Mission, Vision, Pillars, Milestones)
├── initiatives.html      # All Social Initiatives & Interactive Photo Modals
├── team.html             # Board of Trustees & Core Team Committee
├── events.html           # Charity events timeline, locations & details
├── news.html             # Press releases & news coverage
├── gallery.html          # Interactive masonry photo gallery
├── contact.html          # Contact info, Inquiry form & Google Maps embed
├── interactive.css       # Complete F1 design system & responsive styling
├── interactive.js        # Interactive engine (F1 start lights intro, DRS scroll bar, counters)
├── public-data.js        # Initiative photo modals & partner rendering
├── api-config.js         # API endpoint configuration
├── assets/
│   └── imported/         # 66 high-res photographs, partner brand logos, and portraits
└── README.md             # Project documentation
`

---

## ✨ Features Included

- **Exact 1:1 Visual & Functional Match**: Pixel-perfect typography, color palette, gradients, and layouts.
- **F1 Interactive Engine v2.0**:
  - Race start 5-light sequence intro with session persistence.
  - DRS glowing scroll progress bar across the top.
  - Dynamic number counters on scroll for impact statistics.
  - Interactive initiative photo gallery modal popups.
  - Sticky glassmorphic navbar with blur and elevation transitions on scroll.
  - Mobile drawer navigation with responsive hamburger toggle.
- **Full Responsive Design**: Optimized across mobile screens, tablets, laptops, and ultra-wide desktops.
- **All Assets Included**: 66 media files locally preserved with zero missing dependencies.
