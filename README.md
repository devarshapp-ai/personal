# Devarsh Vasa — Personal Portfolio

A fully static personal website for Devarsh Vasa, a Java developer and Application Engineer at Oracle India.

[View the live website](https://devarsh.online/)

## About the website

The portfolio combines a clean editorial layout with subtle developer-console details. It presents professional experience, evidence-backed impact, technical skills, interests beyond work, and simple ways to get in touch.

Highlights include:

- responsive single-page design
- portrait parallax effect with reduced-motion support
- custom desktop cursor with touch-friendly fallbacks
- professional experience timeline and impact metrics
- honest, confidence-labelled technical skills
- personal interests and education
- interactive “premium unlock” joke
- email and LinkedIn contact options
- social-sharing artwork and metadata

## Built with

- React 19
- TypeScript
- vinext and Vite
- CSS
- GitHub Actions and GitHub Pages

The production build exports ordinary HTML, CSS, JavaScript, and image files. The published website does not require an application server.

## Local development

Node.js 22.13 or newer is recommended.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validate the website

```bash
npm run lint
npm test
```

## Deployment

The workflow in `.github/workflows/deploy-pages.yml` builds and publishes the static website whenever `main` is updated.

In the repository settings, choose **Settings → Pages → GitHub Actions** as the publishing source and use `devarsh.online` as the custom domain. The workflow builds every asset for the custom-domain root.

## Optional services

Copy `.env.example` to `.env.local` when enabling optional integrations:

- `NEXT_PUBLIC_FORMSPREE_ID` sends contact-form submissions through Formspree. Without it, the form opens an email draft.
- `NEXT_PUBLIC_GOATCOUNTER_CODE` enables a privacy-friendly visitor total through GoatCounter's image and JSON endpoints; no third-party JavaScript is loaded.
- `NEXT_PUBLIC_SITE_URL` overrides the public URL when using a custom domain.

## Contact

- Email: [devarsh.jobs@gmail.com](mailto:devarsh.jobs@gmail.com)
- LinkedIn: [linkedin.com/in/devarsh-vasa](https://www.linkedin.com/in/devarsh-vasa/)
