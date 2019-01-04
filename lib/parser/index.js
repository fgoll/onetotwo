const chalk = require('chalk')
const parseHTML = require('./html-parser')
const makeAttrsMap = require('../utils').makeAttrsMap
const makeMap = require('../utils').makeMap

const isSVG = makeMap(
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
    true
  )

function warn(msg) {
    console.error(chalk.red(`[compiler]: ${msg}`))
}

function createASTElement(tag, attrs, parent) {
    return {
        type: 1,
        tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent,
        children: []
    }
}

function isForbiddenTag(el) {
    return el.tag === 'style' || el.tag === 'script'
}

function getTagNamespace(tag) {
    if (isSVG(tag)) return 'svg'
    if (tag === 'math') {
        return 'math'
    }
}

/**
 * @param {String} template
 */
module.exports = (template) => {
    let root
    let currentParent
    const stack = []
    let warned = false

    function warnOnce(msg) {
        if (!warned) {
            warned = true
            warn(msg)
        }
    }

    parseHTML(template, {
        start(tag, attrs, unary) {

            const ns = (currentParent && currentParent.ns) || getTagNamespace(tag)
            let element = createASTElement(tag, attrs, currentParent)
            if (ns) {
                element.ns = ns
            }

            if (isForbiddenTag(element)) {
                element.forbidden = true
            }

            if (!root) {
                root = element
            }else if (!stack.length) {
                warnOnce(`Cannot use <${el.tag}> as root element because it may ` +
                'contain multiple nodes.')
            }

            if (currentParent && !element.forbidden) {
                currentParent.children.push(element)
                element.parent = currentParent
            }

            if (!unary) {
                currentParent = element
                stack.push(element)
            }
        },
        end(tagName, start, end) {

            const element = stack[stack.length - 1]
            const lastNode = element.children[element.children.length - 1]
            stack.length -= 1
            currentParent = stack[stack.length - 1]

        },
        chars(text) {

            if (!currentParent) {
                if ((text = text.trim())) {
                    warnOnce(`text "${text}" outside root element will be ignored.`)
                }
                return
            }

            const children = currentParent.children
            if (text) {
                if (text != ' ' || !children.length || children[children.length - 1].text !== ' ') {
                    children.push({
                        type: 3,
                        text
                    })
                }
            }
        },
        comment(text) {
            currentParent.children.push({
                type: 3,
                text,
                isComment: true
            })
        },

        warn(msg) {
            console.warn(chalk.red(msg))
        }
        
    })

    return root
}