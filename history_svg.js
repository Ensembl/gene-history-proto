var svgNS = 'http://www.w3.org/2000/svg';

function addHistorySVG(historyJson, container) {
  var height = container.height();
  var width = container.width();
  var svg = document.createElementNS(svgNS, 'svg');
  container.append(svg);
  var padding = 10;
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);

  var monthRange = (function() {
    var months = [];
    for (var release in historyJson) {
      months.push(monthsSince0000(historyJson[release].date));
    }
    months = months.sort();
    return months.length > 1 ? [ months.shift() - 1, months.pop() ] : [ months[0] - 1, months[0] ];
  })();

  var oneMonthInPixels = (width - padding * 2) / (monthRange[1] - monthRange[0]);

  for (var release in historyJson) {
    historyJson[release].offset = padding + (monthsSince0000(historyJson[release].date) - monthRange[0]) * oneMonthInPixels;
  }

  // draw line
  var historyLine = svg.appendChild(document.createElementNS(svgNS, 'line'));
  historyLine.setAttribute('x1', padding);
  historyLine.setAttribute('x2', width - padding * 2);
  historyLine.setAttribute('y1', parseInt(height/2) - 1);
  historyLine.setAttribute('y2', parseInt(height/2) - 1);
  historyLine.setAttribute('style', 'stroke:rgb(0,0,0);stroke-width:2');
}

function monthsSince0000(date) {
  return parseInt(date.year) * 12 + parseInt(date.month);
}
