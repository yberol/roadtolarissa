
var height = 300;

var svg = d3.select('#newton')
  .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

var points = d3.range(-1, 25, .05)

function phi(x){ return x*x - 5; }
function toCord(point){ return [x(point[0]), y(point[1])]; }
function xToPoint(x){ return [x, phi(x)]; }
var xPosToCord = _.compose(toCord, xToPoint);

function positionCircle(selection, xPos){
  selection.attr({cx: x(xPos), cy: y(phi(xPos))})
}

var xCur = .1;
var xVals = [xCur];
while (_.last(xVals) != xCur || xVals.length === 1){
  xCur = _.last(xVals);
  xVals.push(-phi(xCur)/(2*xCur) + xCur);
}

var x = d3.scale.linear()
    .domain(d3.extent(points))
    .range([0, width])

var y = d3.scale.linear()
    .domain(d3.extent(points, phi))
    .range([height, 0])

var sqrtLine = d3.svg.line()
    .x(x)
    .y(_.compose(y, Math.sqrt))

var quadLine = d3.svg.line()
    .x(x)
    //.y(_.compose(y, _.partialRight(Math.pow, 2)))
    .y(_.compose(y, phi))

var path = svg.append('path')
   // .attr('d', sqrtLine(points))

var path2 = svg.append('path')
    .attr('d', quadLine(points))

svg.append('path')
    .attr('d', ['M', [0, y(0)], 'L', [width, y(0)]].join(''))
svg.append('path')
    .attr('d', ['M', [x(0), 0], 'L', [x(0), height]].join(''))

var activeCircle = svg.append('circle')
    .attr('r', 10)
    .call(positionCircle)
    .on('mouseenter', function(){
      update();
    })

var n = 0;
function update(){
  if (n < xVals.length){ n++; }
  var prev = xToPoint(xVals[n - 1]);
  var cur = xToPoint(xVals[n]);

  svg.append('path')
      .attr('d', ['M', toCord(prev), 'L', toCord(cur)].join(''))

  activeCircle.transition().duration(1500)
      .call(positionCircle, cur[0])
}

//todo add shawdo circle
//keep list of previous poinsts
//adjust function