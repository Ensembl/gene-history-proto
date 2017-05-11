var historyURL = 'https://ens-hsr.github.io/gene-history-proto/data/history.json.js';

var populateSelectBox = function (ele, dataArray) {
  var changes = {};
  $.each(dataArray, function (k) {
    $.each(dataArray[k].changes, function(ch) {
      changes[ch]++;
    })
  });

  ele.html('');
  ele.append("<option> All changes </option>");
  Object.keys(changes).forEach(function(change) {
    var icon = '<span class="glyphicon glyphicon-unchecked aria-hidden="true"></span>';
    var disabled = 'disabled';
    if (dataArray[$('#dd_rel').val()]['changes']) {
      disabled = (dataArray[$('#dd_rel').val()]['changes'][change])? '' : 'disabled';
    }
    ele.append("<option "+ disabled +">" + change + "</option>");
  });
};

var populateReleaseBox = function (ele, dataArray) {
  ele.html('');
  ele.html('');
  Object.keys(dataArray).reverse().forEach(function(rel) {
    ele.append("<option value="+ rel +">Since release " + rel + "</option>");    
  });
};

$(document).on('ready', function() {
  $.ajax({
    url: historyURL,
    dataType: 'json',
    success: function (json) {
      addHistorySVG(json, $('._svg_container'));
      populateReleaseBox($('#dd_rel'), json);
      populateSelectBox($('#dd_changes'), json);

      $('#dd_changes').on('change', function() {
        var change_key = $(this).val();
        var rel_key = $('#dd_rel').val();

        if (json[rel_key]['changes'] && json[rel_key]['changes'][change_key]) {
          // console.log(json[rel_key]['changes'][key]);
          var html = '<p class="title">'+ change_key +'</p>';
          $.each(json[rel_key]['changes'][change_key], function(i, val) {
            html += '<ul class="changes">';
            html += '<li>'+ val +'</li>';
            html += '</ul>';
          })
          $('.results').html(html);
        }
      });

      $('#dd_rel').on('change', function() {
        populateSelectBox($('#dd_changes'), json);
      });

    }
  });

});
