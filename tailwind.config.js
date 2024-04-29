/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        myBlue: {
          1: '#00A8E8',
          2: '#007EA7',
          3: '#003459',
          4: '#00171F'
        }
        // myBlack: '#000814',
        // myDarkBlue: '#001D3D',
        // myBlue: '#003566',
        // myDarkYellow: '#FFC300',
        // myYellow: '#FFD60A'
      }
    }
  },
  plugins: []
}
