const chalk = require('chalk')
module.exports = root => {
    let charSet = {
        'node': '├──',
        'pipe': '│   ', 
        'last': '└── ', 
        'indent': '    '
    }

    // console.log(root)
    function walk(childrens) {

        for (let children of childrens) {
            if (children.type === 'directory') {
                console.log(`${charSet.indent.repeat(children.deep)} ${charSet.last}` + chalk.green(`${children.name}`)) 
            }else {
                console.log(`${charSet.indent.repeat(children.deep)} ${charSet.last}` + chalk.gray(`${children.name}`))
            }

            if (children.children) {
                walk(children.children)
            }
        }
    }

    walk(root.children)
}
