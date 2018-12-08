const fs = require('fs')

/**
 * @param {String} dir
 */
module.exports = (dir) => {
    return new Promise(function(resolve, reject) {
        fs.watchFile(dir, function(cur, prev) {
            fs.readFile(dir, function(err, data) {
                if (err) {
                    return reject(err)
                }
                return resolve(data.toString())
            })
        })
    }) 
    
}