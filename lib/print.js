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
                console.log(`${charSet}${charSet.indent.repeat(children.deep)} ${charSet.last} ${children.name}`) 
            }else {

            }
            

            if (children.children) {
                walk(children.children)
            }
        }
    }

    walk(root.children)
}
