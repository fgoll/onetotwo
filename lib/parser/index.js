const parseHTML = require('./html-parser')

/**
 * @param {String} template
 */
module.exports = (template) => {
    let root

    parseHTML(template, {
        start (tagName, attrs, unary, start, end) {
            // ...
            console.log('start: ' + tagName)
        },
        end (tagName, start, end) {
            // ...
            console.log('end: ' + tagName)
        },
        chars (text) {
            // ...
            console.log('text: ', text)
        },
        comment (text) {
            console.log('comment: ', text)
        }
    })

    return root
}