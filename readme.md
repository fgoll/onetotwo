
# Introduction

A simple CLI to separate html and css (working for mini program)

# Installation
```npm
$ npm install -g onetotwo
```

# Usage
```npm
$ onetotwo mini <project-directory>
```
The above command will create `.jhml.wxml` file in each directory containing the `.wxml` file.
Then you can write the inline style html in `.jhml.wxml` file, and CLI will automatically separate the styles into the respective wxml and wxss files.

# Example 

In `test.jhml.wxml` file write:

```html
<!-- test.jhml.wxml -->
<view class='container' style='background: red'>
  <view class='header' style='background: green;'> 
    header
  </view>
  // pseudo-class :after
  <view class='content' style='background: pink; width: 100%;' :after='content: ""; width: 100%; height: r1; background: black;'>
    content
  </view>
  <view class='footer' style='background: yellow;'>
    footer
  </view>
</view>
```

CLI will watch the change of `test.jhml.wxml` and separate html and css into:

```html 
<!-- test.wxml -->
<view class="container">
  <view class="header"> 
    header
  </view>
  <view class="content">
    content
  </view>
  <view class="footer">
    footer
  </view>
</view>
```
and 

```css
<!-- test.wxss -->
.container  { background: red }
.container .header  { background: green; }
.container .content  { background: pink; width: 100%; }
.container .content:after { content: ""; width: 100%; height: 2rpx; background: black; }.container .footer  { background: yellow; }
```

# Config

CLI will create `jhml.config.js` file in `[project-directory]`, you can add regular expressions to handle your style

```js
/** jhml.config.js */
module.exports = {
  styleREG: [
    {
      reg: 'r\\(?(\\d+(?:\\.\\d+)?)\\)?;?', // translate n px => 2n rpx
      exp:  function($0, $1) {
        return $1 * 2 + 'rpx'
      }
    },{
      reg: 'line: \\s(\\d+);',  // over n line auto hidden
      exp: 'overflow: hidden;text-overflow: ellipsis;display: box;display: -webkit-box;line-clamp: $1; -webkit-line-clamp: $1; -webkit-box-orient: vertical;'
    }
  ]
}
```
you can add other handler such as:

```js
/** jhml.config.js */
module.exports = {
  styleREG: [
    {
      reg: 'hc', // horizontal center
      exp:  'position: absolute; left: 50%; transform: translateX(-50%);'
    },
    {
      reg: 'vc', // vertical center
      exp: 'position: absolute; top: 50%; transform: translateY(-50%);'
    }
// ...
  ]
}
```
then you can write:

```html
<!-- test.jhml.wxml -->
<view class='container'>
    <view class='box' style='hc;'></view>
</view>
```
CLI will generate style:

```css
<!-- test.wxss -->
.container .box { position: absolute; left: 50%; transform: translateX(-50%); }
```

