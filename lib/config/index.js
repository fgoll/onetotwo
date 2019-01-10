const fs = require('fs')
const path = require('path')

function createAndReadConfig(directory) {
  const file = path.join(directory, 'jhml.config.js')

  return new Promise(resolve => {
    fs.exists(file, exists => {
      if (!exists) {
        fs.openSync(file, 'w')
        fs.writeFileSync(file, fs.readFileSync(path.join(__dirname, 'config.js')))
      }
      resolve(file)
    }) 
  })
}

module.exports = {
  createAndReadConfig
}