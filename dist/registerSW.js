if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/block-sudoku-frontend-web/sw.js', { scope: '/block-sudoku-frontend-web/' })})}