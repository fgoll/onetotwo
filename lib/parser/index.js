const parseHTML = require('./html-parser')

/**
 * @param {String} template
 */
module.exports = (template) => {
    let root

    parseHTML(template, {
        start: function(tagName) {
            console.log('start ')
            console.log(tagName)
        }
    })

    return root
}