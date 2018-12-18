const fs = require('fs')

/**
 * @param {String} dir
 * @param {Function} _callback
 */
module.exports = (dir, _callback) => {
    fs.watchFile(dir, function(cur, prev) {
        fs.readFile(dir, function(err, data) {
            if (err) {
                typeof _callback == 'function' && _callback(null, err)
            }
            typeof _callback == 'function' && _callback(data.toString())
        })

        
    })
    
}