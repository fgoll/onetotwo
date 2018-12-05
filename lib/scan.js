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

function ingnore(dir) {
    try {
        let content = fs.readFileSync(join(dir, '.gitignore')).toString().split('\n').filter(_ => _)
        content.push('.git')

        return content
    }catch(_) {
        return []
    }
}

/**
 * @param {String} dir
 */
module.exports = (dir) => {
    
    let currentParent;
    let stack = []

    let ingnorefiles = ingnore(dir)

    function readdirs(dir) {
        
        let node = createNode(dir, 'directory', stack.length, currentParent)

        if (ingnorefiles.indexOf(basename(dir)) != -1) {
            currentParent = stack[stack.length - 1]
            node.parent = currentParent

            return node
        }

        stack.push(node)

        if (currentParent) {
            node.parent = currentParent
        }

        currentParent = node

        let files = fs.readdirSync(dir)

        node.children = files.map(file => {

            let d = join(dir, file)
            let stats = fs.statSync(d)

            let childrenNode = createNode(d, 'file', stack.length, currentParent)

            if (stats.isDirectory()) {

                return readdirs(d)
            }
            return childrenNode
        })

        stack.pop()

        if (stack.length == 0) {
            currentParent = undefined
        }

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