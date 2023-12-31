/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'rs-green': '#283618',
        customWhite: 'rgba(255, 255, 255, 0.75)',
        transparent: 'rgba(255, 255, 255, 0.15)',
        customGrey: 'rgba(51, 51, 51, 0.6)',
        customAsh: 'rgba(51, 51, 51, 0.7)',
      },
      fontSize: {
        '14px': '14px',
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      fontWeight: {
        bold: 500,
        semibold: 600,
        extrabold: 400,
      },
      backgroundImage: {
        'section-bg': "url(/src/assets/bg-design.png)",
        'order-bg': "url(/src/assets/bg-order.png)",
        'customer-bg': "url(/src/assets/bg-customer.png)",
        'product-bg': "url(/src/assets/bg-product.png)"
      },
      backgroundBlendMode: {
        multiply: 'multiply',
      },
      backgroundSize: {
        cover: 'cover',
        contain: 'contain',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      focus: false,
    }),
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}

