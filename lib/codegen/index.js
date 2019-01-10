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

  ast && hanldeAST(ast)

  return html
}

function genCSS(ast) {
  let css = ''
  
  function hanldeAST(element) {

    let selector = ''
    if (element.style) {
      let curr = element
      while (curr) {
        selector = `${curr.selector} ${selector}`
        curr = curr.parent
      }
      
      css += `${selector} { ${element.style} }\n`
    }
    selector = selector.trimRight()

    let pseudos = element.pseudos
    if (pseudos && pseudos.length > 0) {
      for (let i = 0; i < pseudos.length; i ++) {
        css += `${selector}${pseudos[i].name} { ${pseudos[i].value} }`
      }
    }

    if (element.children && Array.isArray(element.children)) {
      element.children.forEach(element => {
        hanldeAST(element)
      });
    }
  }
  
  ast && hanldeAST(ast)
  return css
}

module.exports.generate = function (ast) {
  return {
    html: genHTML(ast),
    css: genCSS(ast)
  }
}

module.exports.genHTML = genHTML