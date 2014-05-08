touch事件
=========

> 由于浏览器不自带touch事件，所以模拟实现一个


## 使用

1. 引入 `eTouch.js`
2. 调用如下：

```
et('div', {
  // 按下时执行
  onStart: function(){},
  // 移动时执行
  onMove: function(){},
  // 抬起后执行
  onEnd: function(){}
});
```

上面的太复杂？

你也可以这样

```

et('.div', function(){
  // 抬起时执行
})

```
