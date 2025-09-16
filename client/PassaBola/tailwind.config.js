import {heroui} from "@heroui/theme"

/** @type {import("tailwindcss").Config} */
export default {
    content: [
        "./index.html",
        "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Jost", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"],
            },
        },
    },

    backgroundImage: {
        "hero-section-title":
            "linear-gradient(91deg, #FFF 32.88%, rgba(255, 255, 255, 0.40) 99.12%)",
    },
    darkMode: "class",
    plugins: [heroui()],
}
