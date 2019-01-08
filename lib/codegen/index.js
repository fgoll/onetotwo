function genHTML(ast) {
  let html = ''

  function hanldeAST(element) {
    if (element.type === 1) {
      html += `<${element.tag}`
      for (attr in element.attrsMap) {
        html += ` ${attr}="${element.attrsMap[attr]}"`
      }
      html += '>'
    } else if (element.type === 3) {
      html += `${element.text}`
    }

    if (element.children && Array.isArray(element.children)) {
      element.children.forEach(element => {
        hanldeAST(element)
      });
    }
    if (element.type === 1)
      html += `</${element.tag}>`
  }

  hanldeAST(ast)

  return html
}

function genCSS(ast) {
  let css = ''

  function hanldeAST(element) {
    if (element.style) {
      let curr = element
      let selector = ''
      while (curr) {
        selector = `${curr.selector} ${selector}`
        curr = curr.parent
      }
      css += `${selector} { ${element.style} }\n`
    }
    if (element.children && Array.isArray(element.children)) {
      element.children.forEach(element => {
        hanldeAST(element)
      });
    }
  }
  
  hanldeAST(ast)
  return css
}

module.exports.generate = function (ast) {
  return {
    html: genHTML(ast),
    css: genCSS(ast)
  }
}

module.exports.genHTML = genHTML