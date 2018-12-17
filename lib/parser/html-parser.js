const makeMap = require('../util').makeMap

/**
 * learning from vue. 
 * github: https://github.com/vuejs/vue/blob/dev/src/compiler/parser/html-parser.js
 */

// Regular
const attribute = /^\s*([^\s<>\/="']+)(?:\s*(=)\s*(?:\s*"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = '[a-zA-Z_][\\W\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const doctype = /^<!DOCTYPE [^>]+>/i
const comment = /^<!\--/
const conditionalComment = /^<!\[/
    
const isPlainTextElement = makeMap('script,style,textarea', true)
const decodingMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&amp;': '&',
    '&#10;': '\n',
    '&#9;': '\t'
}
const encodedAttr = /&(?:lt|gt|quot|amp);/g
const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/

const isIgnoreNewlineTag = makeMap('pre,textarea', true)
const shouldIgnoreFirstNewline = (tag, html) => tag && isIgnoreNewlineTag(tag) && html[0] === '\n'

function decodeAttr(value, shouldDecodeNewlines) {
    const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr
    return value.replace(re, match => decodingMap[match])
}

/**
 * @param {String} html
 * @param {Object} options
 */
module.exports = (html, options) => {
    const stack = []
    
    let index = 0
    let last, lastTag

    while(html) {
        lsat = html

        if (!lastTag || !isPlainTextElement(lastTag)) {
            let textEnd = html.indexOf('<')
            if (textEnd === 0) {
                // Comment:
                if (comment.test(html)) {
                    const commentEnd = html.indexOf('-->')
                    if (commentEnd >= 0) {
                        advance(commentEnd + 3)
                        continue
                    }
                }

                // ConditionalComment:
                if (conditionalComment.test(html)) {
                    const conditionalEnd = html.indexOf(']>')
                    if (conditionalEnd >= 0) {
                        advance(conditionalEnd + 2)
                        continue
                    }
                }

                // Doctype:
                const doctypeMatch = html.match(doctype)
                if (doctypeMatch) {
                    advance(doctypeMatch[0].length)
                    continue
                }

                // End tag

                // Start tag
            }

            if (textEnd >= 0) {

            }
        }
    }

    function advance(n) {
        index += n
        html = html.substring(n)
    }
}
