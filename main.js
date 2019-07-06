var canvas = document.getElementById("canvas")
var context = canvas.getContext("2d")
autoSetCanvas(canvas)
lisenToUser(canvas)

var eraserEnabled = false
eraser.onclick = function() {
  eraserEnabled = true
  actions.className = "actions x"
}

brush.onclick = function() {
  eraserEnabled = false
  actions.className = "actions"
}

function drawCircle(x, y, radius) {
  context.beginPath()
  context.fillStyle = "black"
  context.arc(x, y, radius, 0, Math.PI * 2)
  context.fill()
}

function drawLine(x1, y1, x2, y2) {
  context.beginPath()
  context.strokeStyle = "black"
  context.moveTo(x1, y1) //起点
  context.lineWidth = 6
  context.lineTo(x2, y2) //终点
  context.stroke()
  context.closePath()
}

function autoSetCanvas(canvas) {
  function adjustCanvasSize() {
    var pageWidth = document.documentElement.clientWidth
    var pageHeight = document.documentElement.clientHeight
    canvas.width = pageWidth
    canvas.height = pageHeight //这四行代码出现了两遍，所以我写个函数
    //这是最好背的一种获取页面宽高的方法.注意这和用css设置宽高是不一样的，这是属性，不是样式 css设置样式会出现画图时，鼠标位置和划线位置不一致的现象，这是由于缩放导致的
  }

  adjustCanvasSize()

  window.onresize = function() {
    adjustCanvasSize()
  }
}

function lisenToUser(canvas) {
  var using = false //默认情况下，在使用画笔。意思是工具的使用状态

  var lastPoint = { x: undefined, y: undefined }
  var newPoint = { x: undefined, y: undefined }

  //特性检测
  if (document.body.ontouchstart !== undefined) {
    //触屏设备

    canvas.ontouchstart = function() {
      console.log("开始摸我了")
    }

    canvas.ontouchmove = function() {
      console.log("边模变动")
    }

    canvas.ontouchend = function() {
      console.log("摸完了")
    }
  } else {
    //非触屏设备
    canvas.onmousedown = function(a) {
      var x = a.clientX //这是相对于视口的位置，不是相对于canvas的位置
      var y = a.clientY
      using = true
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      } else {
        lastPoint = { x: x, y: y }
        drawCircle(x, y, 3)
      }
    }
    canvas.onmousemove = function(a) {
      var x = a.clientX
      var y = a.clientY
      if (!using) {
        return
      }
      //如果using是false就执行return跳出函数，就不会执行下面的if，如果using是true函数就继续向下执行，不会return
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
        //这里容易出现一种情况就，我点了橡皮擦，没有按下鼠标橡皮擦，就开始工作了。这样在鼠标移动的时候，就会擦掉我的画。我们需要的是按下鼠标橡皮才开始工作。
        //分支语句的意义在于如果橡皮工作，画笔就不工作。
        //如果橡皮没有被按就和原来的代码没有区别，使用分支语句，不需要对原有代码做大的改动
      } else {
        newPoint = { x: x, y: y }
        drawCircle(x, y, 3)
        drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y) //  注意要实时更新起点的位置
        lastPoint = newPoint // 鼠标只要一动上一个点就变成现在移动到的点
        //只要一移动起点就变成现鼠标移动到的这个点，从而实现连续划线
        //这是最核心的一句话，这个不是api这个是我想出来的，其他都不重要
        //注意这句话一定要在划线的语句之后，画完线之后在把现在点的坐标传给起点，逻辑上最最重要的一点
      }
    }

    canvas.onmouseup = function(a) {
      using = false
    }
  }
}
