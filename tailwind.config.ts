import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,ts,tsx,md}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["DM Sans Variable", "DM Sans", "system-ui", "sans-serif"],
        display: ["Source Serif 4 Variable", "Source Serif 4", "Georgia", "serif"],
        inter: ["DM Sans Variable", "DM Sans", "system-ui", "sans-serif"], // Inter saiu: uma fonte a menos para baixar
        "dm-sans": ["DM Sans Variable", "DM Sans", "system-ui", "sans-serif"],
        "source-serif": ["Source Serif 4 Variable", "Source Serif 4", "Georgia", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Católicos Orantes tokens
        "co-classic": {
          gold: "hsl(var(--co-classic-gold))",
          "gold-light": "hsl(var(--co-classic-gold-light))",
          burgundy: "hsl(var(--co-classic-burgundy))",
          "burgundy-light": "hsl(var(--co-classic-burgundy-light))",
          cream: "hsl(var(--co-classic-cream))",
          "cream-dark": "hsl(var(--co-classic-cream-dark))",
          dark: "hsl(var(--co-classic-dark))",
        },
        "co-modern": {
          slate: "hsl(var(--co-modern-slate))",
          sage: "hsl(var(--co-modern-sage))",
          "sage-light": "hsl(var(--co-modern-sage-light))",
          "warm-white": "hsl(var(--co-modern-warm-white))",
          "soft-blue": "hsl(var(--co-modern-soft-blue))",
          muted: "hsl(var(--co-modern-muted))",
        },
        "co-warm": {
          terracotta: "hsl(var(--co-warm-terracotta))",
          "terracotta-light": "hsl(var(--co-warm-terracotta-light))",
          sand: "hsl(var(--co-warm-sand))",
          "sand-dark": "hsl(var(--co-warm-sand-dark))",
          cream: "hsl(var(--co-warm-cream))",
          gold: "hsl(var(--co-warm-forest))",
          forest: "hsl(var(--co-warm-forest))",
          "forest-light": "hsl(var(--co-warm-forest-light))",
          brown: "hsl(var(--co-warm-brown))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate, typography],
} satisfies Config;
