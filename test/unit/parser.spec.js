var parse = require('../../lib/parser')
var baseOptions = require('../../lib/config/config');

describe('parser', () => {
  it('simple element', () => {
    const ast = parse('<h1>hello world</h1>', baseOptions)

    expect(ast.tag).toBe('h1')
    expect(ast.children[0].text).toBe('hello world')
  })

  it('child elements', () => {
    const ast = parse('<ul><li>hello world</li></ul>', baseOptions)
    expect(ast.tag).toBe('ul')
    expect(ast.children[0].tag).toBe('li')
    expect(ast.children[0].children[0].text).toBe('hello world')
    expect(ast.children[0].parent).toBe(ast)
  })

  it('unary element', () => {
    const ast = parse('<hr>', baseOptions)
    expect(ast.tag).toBe('hr')
    expect(ast.children.length).toBe(0)
  })

  it('svg element', () => {
    const ast = parse('<svg><text>hello world</text></svg>', baseOptions)
    expect(ast.tag).toBe('svg')
    expect(ast.children[0].tag).toBe('text')
    expect(ast.children[0].children[0].text).toBe('hello world')
    expect(ast.children[0].parent).toBe(ast)
  })

  it('remove duplicate whitespace text nodes caused by comments', () => {
    const ast = parse(`<div><a></a> <!----> <a></a></div>`, baseOptions)
    expect(ast.children.length).toBe(3)
    expect(ast.children[0].tag).toBe('a')
    expect(ast.children[1].text).toBe(' ')
    expect(ast.children[2].tag).toBe('a')
  })

})