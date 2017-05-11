var svgNS = 'http://www.w3.org/2000/svg';

var releaseOffsets = {};
var lastRelease = 0;
var dimensions = {}
var selectorHeight = 30;

function addHistorySVG(historyJson, container) {
  var height = container.height();
  var width = container.width();
  var svg = document.createElementNS(svgNS, 'svg');
  container.append(svg);
  var padding = 10;
  var yAxis = parseInt(height/2) - 1;
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  dimensions.width = width;
  dimensions.height = height;

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
    releaseOffsets[release] = padding + (monthsSince0000(historyJson[release].date) - monthRange[0]) * oneMonthInPixels;
    if (release > lastRelease) {
      lastRelease = release;
    }
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

  // shaded selection box
  var selectionBox = svg.appendChild(document.createElementNS(svgNS, 'rect'));

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
      circle.setAttribute('fill', !!changes ? 'black' : 'white');

      // hover tool tip
      $(circle).mouseenter({tip: '<p>Release: ' + release + '</p>' + compileChanges(changes)}, function(e) {
        $('#svg-tip').html(e.data.tip).css({left: e.pageX, top: e.pageY}).show();
      });
      $(circle).mouseleave(function() {
        $('#svg-tip').empty().hide();
      });
    })(releaseOffsets[release], release, historyJson[release].changes);
  }

  drawSelectionBox(container, lastRelease);
}

function monthsSince0000(date) {
  return parseInt(date.year) * 12 + parseInt(date.month);
}

function compileChanges(changes) {
  if (!changes) {
    return '<p>No changes</p>';
  }

  var html = '';
  for (var type in changes) {
    html = html + '<li><span class="colour-box" style="background-color:' + COLOURS[type] + '"></span>' + type + '</li>';
  }

  return '<ul>' + html + '</ul>';
}

function drawSelectionBox(container, release) {
  var svg = container.find('svg')[0];
  var selectionBox = svg.getElementsByTagName('rect')[0];

  selectionBox.setAttribute('y', (dimensions.height - selectorHeight)/2 - 1);
  selectionBox.setAttribute('x', releaseOffsets[release] - 5);
  selectionBox.setAttribute('rx', 5);
  selectionBox.setAttribute('ry', 5);
  selectionBox.setAttribute('width', releaseOffsets[lastRelease] - releaseOffsets[release] + 10);
  selectionBox.setAttribute('height', selectorHeight);
  selectionBox.setAttribute('style', 'fill:rgb(185, 255, 50);fill-opacity:0.4');
}
