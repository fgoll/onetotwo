const makeMap = require('../util').makeMap

/**
 * learning from vue. 
 * github: https://github.com/vuejs/vue/blob/dev/src/compiler/parser/html-parser.js
 */

// Regular
const attribute = /^\s*([^\s<>\/="']+)(?:\s*(=)\s*(?:\s*"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const doctype = /^<!DOCTYPE [^>]+>/i
const comment = /^<!\--/
const conditionalComment = /^<!\[/

const isPlainTextElement = makeMap('script,style,textarea', true)
const reCache = {}

const isIgnoreNewlineTag = makeMap('pre,textarea', true)
const shouldIgnoreFirstNewline = (tag, html) => tag && isIgnoreNewlineTag(tag) && html[0] === '\n'

const isUnaryTag = makeMap(
    'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
    'link,meta,param,source,track,wbr'
)

/**
 * @param {String} html
 * @param {Object} options
 */
module.exports = (html, options) => {
    const stack = []

    let index = 0
    let last, lastTag


    while (html) {
        last = html

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
                const endTagMatch = html.match(endTag)
                if (endTagMatch) {
                    const curIndex = index
                    advance(endTagMatch[0].length)
                    parseEndTag(endTagMatch[1], curIndex, index)
                    continue
                }

                // Start tag
                const startTagMatch = parseStartTag()
                if (startTagMatch) {
                    handleStartTag(startTagMatch)
                    continue
                }
            }
            let text, rest, next
            if (textEnd >= 0) {
                rest = html.slice(textEnd)
                while (!comment.test(rest) &&
                       !endTag.test(rest) &&
                       !startTagOpen.test(rest) &&
                       !conditionalComment.test(rest)) {
                           next = rest.indexOf('<')
                           if (next < 0) break
                           textEnd += next
                           rest = html.slice(textEnd)
                       }
                text = html.substring(0, textEnd)
                advance(textEnd)
            }

            if (textEnd < 0) {
                text = html
                html = ''
            }

            if (options.chars && text) {
                options.chars(text)
            }
        }else {
            let endTagLength = 0
            const stackedTag = lastTag.toLowerCase()
            const reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp(`([\\s\\S]*?)(</${stackedTag}[^>]*>)`, 'i'))
            const rest = html.replace(reStackedTag, function(all, text, end) {
                endTagLength = end.length
                if (shouldIgnoreFirstNewline(stackedTag, text)) {
                    text = text.slice(1)
                }
                options.chars && options.chars(text)
                return ''
            })

            index = html.length - rest.length
            html = rest
            parseEndTag(reStackedTag, index - endTagLength, index)
        }

        if (html === last) {
            options.chars && options.chars(html)
            options.warn && options.warn(`Mal-formatted tag at end of template: "${html}"`)
            break
        }
    }

    parseEndTag()

    function advance(n) {
        index += n
        html = html.substring(n)
    }

    function parseStartTag() {
        const start = html.match(startTagOpen)
        
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
                start: index
            }
            advance(start[0].length)

            let end, attr
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push(attr)
                advance(attr[0].length)
            }
            if (end) {
                match.unarySlash = end[1]
                advance(end[0].length)
                match.end = index
                return match
            }
        }
    }

    function handleStartTag(match) {
        const tagName = match.tagName
        const unarySlash = match.unarySlash

        const unary = isUnaryTag(tagName) || !!unarySlash

        const len = match.attrs.length
        const attrs = new Array(len)
        for (let i = 0; i < len; i++) {
            const args = match.attrs[i]
            const value = args[3] || args[4] || args[5] || ''
            attrs[i] = {
                name: args[1],
                value: value
            }
        }

        if (!unary) {
            stack.push({
                tag: tagName,
                lowerCasedTag: tagName.toLowerCase(),
                attrs: attrs
            })
            lastTag = tagName
        }

        if (options.start) {
            options.start(tagName, attrs, unary, match.start, match.end)
        }
    }

    function parseEndTag(tagName, start, end) {
        let pos, lowerCasedTagName

        if (tagName) {
            lowerCasedTagName = tagName.toLowerCase()
            for (pos = stack.length - 1, pos >= 0; pos--;) {
                if (stack[pos].lowerCasedTag === lowerCasedTagName) {
                    break
                }
            }
        } else {
            pos = 0
        }

        if (pos >= 0) {
            for (let i = stack.length - 1; i >= pos; i--) {
                if ((i > pos || !tagName) && options.warn) {
                    options.warn(
                        `tag <${stack[i].tag}> has no matching end tag.`
                    )
                }
                if (options.end) {
                    options.end(stack[i].tag, start, end)
                }
            }

            stack.length = pos
            lastTag = pos && stack[pos - 1].tag
        }else if (lowerCasedTagName === 'br') {
            options.start && options.start(tagName, [], true, start, end)
        }else if (lowerCasedTagName === 'p') {
            options.start && options.start(tagName, [], false, start, end)
            options.end && options.end(tagName, start, end)
        }
    }
}