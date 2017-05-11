var svgNS = 'http://www.w3.org/2000/svg';

function addHistorySVG(historyJson, container) {
  var height = container.height();
  var width = container.width();
  var svg = document.createElementNS(svgNS, 'svg');
  container.append(svg);
  var padding = 10;
  var yAxis = parseInt(height/2) - 1;
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);

  var monthRange = (function() {
    var months = [];
    for (var release in historyJson) {
      months.push(monthsSince0000(historyJson[release].date));
    }
    months = months.sort();
    return months.length > 1 ? [ months.shift() - 1, months.pop() + 1 ] : [ months[0] - 1, months[0] + 1 ];
  })();

  var oneMonthInPixels = (width - padding * 2) / (monthRange[1] - monthRange[0]);

  for (var release in historyJson) {
    historyJson[release].offset = padding + (monthsSince0000(historyJson[release].date) - monthRange[0]) * oneMonthInPixels;
  }

  // draw line
  var historyLine = svg.appendChild(document.createElementNS(svgNS, 'line'));
  historyLine.setAttribute('x1', 0);
  historyLine.setAttribute('x2', width);
  historyLine.setAttribute('y1', yAxis);
  historyLine.setAttribute('y2', yAxis);
  historyLine.setAttribute('style', 'stroke:rgb(0,0,0);stroke-width:2');

  // draw history dots
  for (var release in historyJson) {
    (function(offset, release, changes) {
      var circle = svg.appendChild(document.createElementNS(svgNS, 'circle'));
      circle.setAttribute('cx', offset);
      circle.setAttribute('cy', yAxis);
      circle.setAttribute('r', 4);
      circle.setAttribute('stroke', 'black');
      circle.setAttribute('stroke-width', 1);
      if (!!changes) {
        circle.setAttribute('fill', 'black');
      }
    })(historyJson[release].offset, release, historyJson[release].changes);
  }

  // draw years bar
  for (var i = monthRange[0]; i <= monthRange[1]; i++) {
    if (i%12 == 0) {
      (function(year, offsetX) {
        var yearLine = svg.appendChild(document.createElementNS(svgNS, 'line'));
        yearLine.setAttribute('x1', offsetX);
        yearLine.setAttribute('x2', offsetX);
        yearLine.setAttribute('y1', 0);
        yearLine.setAttribute('y2', height);
        yearLine.setAttribute('style', 'stroke:rgb(200,200,200);stroke-width:1');
        var text = svg.appendChild(document.createElementNS(svgNS, 'text'));
        text.setAttribute('x', offsetX + 5);
        text.setAttribute('y', height - 10);
        text.setAttribute('fill', 'rgb(200,200,200)');
        text.innerHTML = year;
      })(i/12, (i - monthRange[0] + 1) * oneMonthInPixels);
    }
  }
}

function monthsSince0000(date) {
  return parseInt(date.year) * 12 + parseInt(date.month);
}
