const path = require('path')
const basename = dir => path.basename(dir),
      extname = dir => path.extname(dir)
module.exports = {
    /**
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
    },

    /**
     * 
     * @param {String} str 
     * @param {Boolean} expectsLowerCase 
     */
    makeMap(str, expectsLowerCase) {
        const map = Object.create(null)
        const list = str.split(",")
        for (let i = 0; i < list.length; i ++) {
            map[list[i]] = true
        }
        return expectsLowerCase 
            ? val => map[val.toLowerCase()]
            : val => map[val]
    },

    /**
     * 
     * @param {Array} attrs 
     */
    makeAttrsMap(attrs) {
        const map = {}
        for (let i = 0; i < attrs.length; i ++) {
            map[attrs[i].name] = attrs[i].value
        }
        return map
    },

}