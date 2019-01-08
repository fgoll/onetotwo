
# Introduction

A simple CLI to separate html and css

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
  <view class='footer' style='background: yellow;'>
    footer
  </view>
</view>
```

CLI will watch the change of `test.jhml.wxml` and separate html and css into:
```html 
<!-- test.wxml -->
<view class='container'>
  <view class='header'> 
    header
  </view>
  <view class='footer'>
    footer
  </view>
</view>
```
and 
```css
<!-- test.wxss -->
.container{background: red}
.container .header{background: green;}
.container .footer{background: yellow;}
```
