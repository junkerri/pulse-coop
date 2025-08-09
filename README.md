# Pulse COOP

A modern, clean website for Pulse COOP - a worker-owned tech cooperative founded by Aastha, Riley, and Andrew.

## 🏢 About Pulse COOP

Pulse COOP is built on the foundation that technology work should be democratic, ethical, and sustainable. As a worker-owned cooperative, every member has an equal say in operations, project selection, and success distribution.

### Our Values

- **Democratic Ownership**: Every worker has an equal voice and stake
- **Ethical Technology**: Building solutions that benefit communities
- **Sustainable Practices**: Long-term thinking in everything we do
- **Collaborative Growth**: We succeed together, not individually

## 🚀 Project Structure

This is an Astro project with Tailwind CSS for styling, featuring a clean, modern design inspired by forge.coop.

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── MainLayout.astro
│   ├── pages/
│   │   └── index.astro
│   ├── styles/
│   │   └── global.css
│   └── components/
└── package.json
```

### Key Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Typography**: Inter font family for clean readability
- **Full-Screen Sections**: Hero, About, and Contact sections
- **Smooth Scrolling**: Enhanced navigation between sections
- **Accessible**: Semantic HTML and proper contrast ratios

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) - Fast, modern static site generator
- **Styling**: [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- **Typography**: [Inter Font](https://fonts.google.com/specimen/Inter) - Clean, modern typeface
- **Icons**: Heroicons SVG icons for UI elements

## 🧞 Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pulse-coop
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4321` to see the site

## 📝 Customization

### Content Updates

- Edit `src/pages/index.astro` to modify page content
- Update contact information in the Contact section
- Modify the tagline and descriptions as needed

### Styling Changes

- All styles use Tailwind CSS classes
- Custom styles can be added in `src/layouts/MainLayout.astro`
- Global styles are in `src/styles/global.css`

### Layout Modifications

- The main layout is in `src/layouts/MainLayout.astro`
- Add new components in `src/components/` directory
- Create new pages in `src/pages/` directory

## 🌐 Deployment

This site can be deployed to any static hosting service:

- **Netlify**: Connect your GitHub repo for automatic deployments
- **Vercel**: Import your project for seamless deployment
- **GitHub Pages**: Use the built-in Actions for deployment
- **Cloudflare Pages**: Fast global deployment

Build the site for production:

```bash
npm run build
```

The built site will be in the `./dist/` directory.

## 📧 Contact

For questions about the website or Pulse COOP:

- Email: hello@pulse.coop

## 📄 License

This project is part of Pulse COOP's open-source initiatives. Built with ❤️ by the Pulse COOP team.

## Formspree Contact Form

This project uses Formspree for contact submissions.

### Environment variables

Provide one of the following (client-exposed) environment variables:

- `PUBLIC_FORMSPREE_FORM_ID` (Astro-friendly, recommended)
- `NEXT_PUBLIC_FORM` (compatible with Vercel Formspree integration)

Example `.env`:

```
PUBLIC_FORMSPREE_FORM_ID=your_formspree_form_id
```

### Where it’s used

- Service: `src/lib/formspree.ts`
- Form UI: `src/components/ContactForm.astro`
- Section embedding: `src/components/ContactSection.astro`

### How it works

`ContactForm.astro` posts to Formspree via `submitToFormspree` using `fetch` to `https://formspree.io/f/<FORM_ID>` with `FormData`.

If the env var is missing, the form will display an error on submit.
