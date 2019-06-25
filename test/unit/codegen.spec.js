var parse = require('../../lib/parser')
var baseOptions = require('../../lib/config/config');
var generate = require('../../lib/codegen').generate


describe('codegen', () => {
  it('simple style element', () => {
    const ast = parse('<h1 style="color:red">hello world</h1>', baseOptions)

    var code = generate(ast)

    expect(code.html).toBe('<h1>hello world</h1>')
    expect(code.css).toBe('h1  { color:red }\n')
  })

  it('simple class and style element', () => {
    const ast = parse('<h1 class="h" style="color:red">hello world</h1>', baseOptions)

    var code = generate(ast)

    expect(code.html).toBe('<h1 class="h">hello world</h1>')
    expect(code.css).toBe('.h  { color:red }\n')
  })

})