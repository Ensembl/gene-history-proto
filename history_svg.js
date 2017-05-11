var svgNS = 'http://www.w3.org/2000/svg';

function addHistorySVG(historyJson, container) {
  var svg = container.append(document.createElementNS(svgNS, 'svg'));
  var height = container.height();
  var width = container.width();
  var padding = 10;
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);

  var monthRange = function() {
    var months = [];
    for (var release in historyJson) {
      months.push(monthsSince0000(historyJson[release].date));
    }
    months = months.sort();
    return months.length > 1 ? [ months.shift() - 1, months.pop() ] : [ months[0] - 1, months[0] ];
  }

  var oneMonthInPixels = (width - padding * 2) / (monthRange[1] - monthRange[0]);

  for (var release in historyJson) {
    historyJson[release].offset = padding + (monthsSince0000(historyJson[release].date) - monthRange[0]) * oneMonthInPixels;
  }

  // draw line
  var historyLine = svg.appendChild(document.createElementNS(svgNS, 'line'));
  historyLine.x1 = padding;
  historyLine.x2 = width - padding * 2;
  historyLine.y1 = historyLine.y2 = parseInt(height/2) - 1;
  historyLine.style = 'stroke:rgb(0,0,0);stroke-width:2';
}

function monthsSince0000(date) {
  return parseInt(date.year) * 12 + parseInt(date.month);
}
