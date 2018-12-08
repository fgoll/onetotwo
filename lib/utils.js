const path = require('path')
const basename = dir => path.basename(dir),
      extname = dir => path.extname(dir)
module.exports = {
    /**
     * 
     * @param {String} name 
     * @param {String} path 
     * @param {String} type 
     * @param {Number} deep
     */
    createNode(path, type, deep, parent) {

        return {
            type: type,
            ext: extname(path),
            name: basename(path),
            path: path,
            deep: deep,
            parent,
            children: []
        }
    }
}