var historyURL = 'https://ens-hsr.github.io/gene-history-proto/data/history.json.js';
var GENE = (window.location.hash.match('gene=([^\;]+)') || ['XYZ']).pop();

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
    var month = dataArray[rel].date.month.length === 1 ? "0" + dataArray[rel].date.month : dataArray[rel].date.month;
    ele.append("<option value="+ rel +">release " + rel + " ("+ month + "/" + dataArray[rel].date.year+")</option>");    
  });
};

var _alert = function(str) {
  alert(str);
}

var displayImage = function(e, r) {
  var img1 = '/gene-history-proto/images/sequence_change.png';
  $(e.target).siblings('div.image').html('<br><img src='+ img1 +'></img><button type="button" class="btn btn-primary" onClick="_alert(\'Sequence successfully downloaded\');"> Download Sequence</button>');
}

$(document).on('ready', function() {
  $('#gene-name-heading').html(GENE);
  $.ajax({
    url: historyURL,
    dataType: 'json',
    success: function (json) {
      // replace gene name in the JSON accordng top url hash
      json = JSON.parse(JSON.stringify(json).replace(/__gene__/g, GENE));
      addHistorySVG(json, $('._svg_container'));
      populateReleaseBox($('#dd_rel'), json);
      // populateSelectBox($('#dd_changes'), json);
      $('#dd_changes').on('change', function() {
        var change_key = $(this).val();
        var rel_key = $('#dd_rel').val();
        $('#release-heading').html(" "+$('#dd_rel option:selected').text());
        drawSelectionBox($('#svg-container'), rel_key);
        var html = '';
        if (change_key == 'All changes') {
          html += '<p class="title" style="font-weight:bold; margin-top:20px;">'+ change_key +'</p>';

          $.each(Object.keys(json).reverse(), function(i, rel) {
            if (json[rel]['changes']) {
              html += '<p class="title">Release '+ rel +'</p>';
            }
            if (json[rel]['changes']) {
              $.each(json[rel]['changes'], function(ch) {
                html += '<ul class="all_changes">';
                html += '<li>'+ ch +'</li>';
                $.each(json[rel]['changes'][ch], function(i, val) {
                  html += '<ul class="changes">';
                  if (ch == 'Transcript sequence changed' || ch == 'Protein sequence changed') {
                    val = val + ' <button type="button" class="btn btn-default" onClick=displayImage(event,"'+rel+'");>View</button><div class="image"></div>';
                  }
                  html += '<li>'+ val +'</li>';
                  html += '</ul>';
                });
                html += '</ul>';
              })
            }
            if (rel == rel_key) {
              $('.results').html(html);
              return false;
            }
          })
        }          
        else {
          if (json[rel_key]['changes'] && json[rel_key]['changes'][change_key]) {
            // console.log(json[rel_key]['changes'][key]);
            html = '<p class="title" style="font-weight:bold; margin-top:20px;">'+ change_key +'</p>';
            $.each(json[rel_key]['changes'][change_key], function(i, val) {
              html += '<ul class="changes">';
              if (change_key == 'Transcript sequence changed' || change_key == 'Protein sequence changed') {
                val = val + ' <button type="button" class="btn btn-default" onClick=displayImage(event,"'+rel_key+'");>View</button><div class="image"></div>';
              }
              html += '<li>'+ val +'</li>';
              html += '</ul>';
            })
          }
        }

        $('.results').html(html);

      });

      $('#dd_rel').on('change', function() {
        populateSelectBox($('#dd_changes'), json);
        $('#dd_changes').trigger('change');
      });

      $('#dd_rel').trigger('change');
    }
  });



});
