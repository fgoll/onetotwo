const fs = require('fs')
const path = require('path')
const basename = dir => path.basename(dir),
      extname = dir => path.extname(dir),
      join = (dir, file) => path.join(dir, file)

/**
 * 
 * @param {String} name 
 * @param {String} path 
 * @param {String} type 
 * @param {Number} deep
 */
function createNode(path, type, deep, parent) {
    // console.log(path)
    // console.log(extname(path))
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

/**
 * @param {String} dir
 */
module.exports = (dir) => {
    
    let currentParent;
    let stack = []
    let root

    function readdirs(dir) {
        let node = createNode(dir, 'directory', stack.length, currentParent)
        stack.push(node)

        if (!root) {
            root = node
        }else if (currentParent) {
            node.parent = currentParent
        }

        let files = fs.readdirSync(dir)

        node.children = files.map(file => {

            let d = join(dir, file)
            let stats = fs.statSync(d)
            let childrenNode = createNode(d, 'file', stack.length, currentParent)

            if (stats.isDirectory()) {
                currentParent = childrenNode
                return readdirs(d)
            }
            return childrenNode
        })

        stack.pop()

        return node
    }

    try {
        if (fs.statSync(dir).isFile()) {
            return Promise.reject('must be a directory')
        }

        return Promise.resolve(readdirs(dir))
    }catch(err) {
        return Promise.reject(err)
    }
    

    
}