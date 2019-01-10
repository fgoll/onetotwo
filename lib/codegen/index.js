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

function genCSS(ast, config) {
  let css = ''
  let styleREG = config.styleREG || {}
  console.log('')
  function hanldeAST(element) {
    if (element.style) {
      let curr = element
      let selector = ''
      while (curr) {
        selector = `${curr.selector} ${selector}`
        curr = curr.parent
      }
      let style = element.style
      for (let style_reg of styleREG) {

        style = style.replace(new RegExp(style_reg.reg, 'g'), style_reg.exp)

      }
      css += `${selector} { ${style} }\n`
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

module.exports.generate = function (ast, config) {
  return {
    html: genHTML(ast),
    css: genCSS(ast, config)
  }
}

module.exports.genHTML = genHTML