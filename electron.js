const { app, BrowserWindow } = require('electron')

let win

const options = {
    "dev": true
}

function createWindow () {
    win = new BrowserWindow({ width: 800, height: 600 })

    // win.loadFile('dist/index.html')

    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })

    if (options.dev) {
        win.loadURL('http://localhost:8080');
    } else {
        win.loadURL(win.loadFile('dist/index.html'));
    }
}

app.on('ready', createWindow)


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})