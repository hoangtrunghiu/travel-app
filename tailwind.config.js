module.exports = {
   future: {
      // removeDeprecatedGapUtilities: true,
      // purgeLayersByDefault: true,
   },
   content: [
      './src/**/*.{js,jsx,ts,tsx}', // Quét tất cả file trong src
      './public/index.html', // Quét file index.html nếu có
   ],
   purge: [],
   theme: {
      extend: {
         animation: {
            zoom: 'zoomInOut 2s infinite ease-in-out',
         },
         keyframes: {
            zoomInOut: {
               '0%, 100%': { transform: 'scale(1)' },
               '50%': { transform: 'scale(1.1)' },
            },
         },
      },
   },
   variants: {},
   plugins: [],
};
