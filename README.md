# BTD6 Paragon Calculator

[![GitHub stars](https://img.shields.io/github/stars/ctxx3/BTD6ParagonCalculator?style=flat-square)](https://github.com/ctxx3/BTD6ParagonCalculator/stargazers)
[![License](https://img.shields.io/github/license/ctxx3/BTD6ParagonCalculator?style=flat-square)](LICENSE)
[![Deploy](https://img.shields.io/github/deployments/ctxx3/BTD6ParagonCalculator/github-pages?label=deployed&style=flat-square)](https://ctxx3.github.io/BTD6ParagonCalculator/)

A SvelteKit calculator for BTD6 Paragon degrees.

> **Forked from [Kaister300/BTD6ParagonCalculator](https://github.com/Kaister300/BTD6ParagonCalculator). This fork features a complete SvelteKit rewrite and improved UX.**

![Screenshot of BTD6 Paragon Calculator](https://raw.githubusercontent.com/ctxx3/BTD6ParagonCalculator/main/.github/screenshot.webp)

---

## Quick Start

Clone and run locally with [bun](https://bun.sh):

```bash
git clone https://github.com/ctxx3/BTD6ParagonCalculator
cd BTD6ParagonCalculator
bun install
bun run dev
```

Build for production:

```bash
bun run build
```

---

## Features

- Supports all 13 current paragons (as of version 54.0)
- Responsive design, works on mobile
- TypeScript for type safety, Tailwind CSS for styling

---

## Project Structure

```
src/
├── routes/+page.svelte      # main calculator UI
├── components/slider.svelte # custom range slider
├── lib/paragon-calc.ts      # degree calculation logic
└── app.css                  # global styles + Tailwind theme
static/
└── json/paragons.json       # tower data (prices, names)
```

---

## Credits

- Original project by [Kaister300](https://github.com/Kaister300/BTD6ParagonCalculator)
- Fork & SvelteKit rewrite by [Ctx3](https://github.com/ctxx3)

---

## License

MIT License. See [LICENSE](LICENSE) for details.
