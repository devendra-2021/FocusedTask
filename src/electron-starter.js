const { menubar } = require('menubar');

const mb = menubar({
  index: 'http://localhost:3000',
  browserWindow: {
    webPreferences: {
      nodeIntegration: true,
    },
  },
});

mb.on('ready', () => {
  console.log('app is ready');
  // your app code here
});

mb.app.allowRendererProcessReuse = false;
