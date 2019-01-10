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