import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import sequelize from '@config/dbConnect'
import User from '@db/models/User'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  ipcMain.on('setData', async (_, data) => {
    try {
      const checkUser = await User.findOne({ where: { firstName: data.firstName } })
      if (!checkUser) {
        await User.create(data)
      }
    } catch (error) {
      console.error('Error inserting data:', error)
    }
  })

  ipcMain.on('getData', async (event) => {
    try {
      const users = await User.findAll({ raw: true })
      event.reply('getDataResponse', users)
    } catch (error) {
      console.error('Error retrieving data:', error)
    }
  })
}

app.whenReady().then(async () => {
  try {
    await sequelize.sync()
    console.log('Connection to the database was successful.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }

  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
