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
                
                if (children.work) {

                    console.log(`${charSet.indent.repeat(children.deep)} ${charSet.last}` + chalk`{greenBright.bold ${children.name} - <working>}`) 
                }else {
                    
                    console.log(`${charSet.indent.repeat(children.deep)} ${charSet.last}` + chalk.green(`${children.name}`)) 
                }
                
            }else {
                if (children.watch) {
                    console.log(`${charSet.indent.repeat(children.deep)} ${charSet.last}` + chalk.cyanBright(`${children.name} - <watching>`))
                }else if (children.config) {
                    console.log(`${charSet.indent.repeat(children.deep)} ${charSet.last}` + chalk.bgRedBright(`${children.name} - <config file>`))
                }else {
                    console.log(`${charSet.indent.repeat(children.deep)} ${charSet.last}` + chalk.gray(`${children.name}`))
                }
                
            }

            if (children.children) {
                walk(children.children)
            }
        }
    }

    walk(root.children)
}
