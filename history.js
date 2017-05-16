var historyURL = 'data/history.json.js';
var GENE = (window.location.hash.match('gene=([^\;]+)') || ['XYZ']).pop();

var populateSelectBox = function (ele, dataArray, default_selected) {
  var all_types = {};
  $.each(dataArray, function (k) {
    $.each(dataArray[k].changes, function(ch) {
      all_types[ch] = 1;
    });
  });

  var available_types = {};
  var rel_key = $('#dd_rel').val();
  $.each(Object.keys(dataArray).reverse(), function(i, rel) {
    $.each(dataArray[rel].changes, function(ch) {
      available_types[ch] = 1;
    });
    if (rel == rel_key) {
      return false;
    }
  });

  ele.html('');
  ele.append("<option> All </option>");
  Object.keys(all_types).forEach(function(type) {
    var icon = '<span class="glyphicon glyphicon-unchecked aria-hidden="true"></span>';
    var disabled = 'disabled';
    var selected = (default_selected === type) ? ' selected="selected" ' : '';

    disabled = available_types[type] ? '' : 'disabled';
    ele.append("<option "+ disabled + selected +">" + type + "</option>");
  });
};

var populateReleaseBox = function (ele, dataArray) {
  ele.html('');
  ele.html('');
  Object.keys(dataArray).reverse().forEach(function(rel) {
    ele.append("<option value="+ rel +">release " + (rel-1) + " ("+ dataArray[rel].date.month_string + "/" + dataArray[rel].date.year+")</option>");    
  });
};

var _alert = function(str) {
  $('#alertModal .modal-title').html('Download');
  $('#alertModal .modal-body p').html('Your sequence will be downloaded');
  $('#alertModal').modal();

  $('#alertModal').on('hidden.bs.modal', function () {
    $('#createAlertModal').modal();
  })
}

var buttonClick = function(e) {
  var type = ($(e.target).data('type'));

  if (type.match('sequence')) {
    if ($(e.target).html() == 'View details') {
      if (!$(e.target).siblings('div.image').html()) {
        var img1 = '/gene-history-proto/images/sequence_change.png';
        $(e.target).siblings('div.image').html('<br><img src='+ img1 +'></img><button type="button" class="btn btn-primary btn-sm" onClick="_alert(\'Sequence successfully downloaded\');"> Download Sequence</button>');
      }
      else {
        $(e.target).siblings('div.image').show();
      }
    }
    else {
      $(e.target).siblings('div.image').hide();
    }
    $(e.target).html(($(e.target).html() == 'View details')? 'Hide details' : 'View details');
  }
  else {
    $('#alertModal .modal-title').html(BUTTONS[type]['text']);
    $('#alertModal .modal-body p').html(BUTTONS[type]['message']);
    $('#alertModal').modal();
  }
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
      // populateSelectBox($('#dd_types'), json);

      $('#dd_types').on('change', function() {
        var change_key = $('#dd_types :selected').val();
        var disabled   = $('#dd_types :selected').attr('disabled');
        var rel_key    = $('#dd_rel').val();
        drawSelectionBox($('#svg-container'), rel_key);
        var pre_text   = disabled ? 'No' : 'Showing';
        var html = '<i><p class="subtitle">'+ pre_text +' <b>'+ change_key.toLowerCase() +'</b> changes between release <b>' + (rel_key-1) + '</b> and <b>' + Object.keys(json).reverse()[0] +'</b></p></i><hr>';

        if (change_key == 'All') {
          // $.each(Object.keys(json).reverse(), function(i, rel) {
          for (var i=rel_key; i<=Object.keys(json).reverse()[0]; i++) {
            var rel = i;
            if (json[rel]['changes']) {
              html += '<p class="title">Release '+ rel +'</p>';

              $.each(json[rel]['changes'], function(type) {
                html += '<ul class="all_types">';
                html += '<li class="subtitle"><span class="colour-box" style="background-color:' + COLOURS[type] + '">'+ type +'</span></li>';

                if (json[rel]['changes'][type]) {
                  $.each(json[rel]['changes'][type], function(i, val) {
                    html += '<ul class="changes">';
                    val = '<span class="item">' + val + '</span> <button type="button" class="btn btn-default btn-xs" data-type="'+ type +'" onClick=buttonClick(event,"'+rel+'");>'+ BUTTONS[type]['text'] +'</button><div class="image"></div>';
                    html += '<li>'+ val +'</li>';
                    html += '</ul>';
                  });
                }

                html += '</ul>';
              })
              html += '<hr>'
            }
          }
        }          
        else {

          // $.each(Object.keys(json).reverse(), function(i, rel) {
          for (var i=rel_key; i<=Object.keys(json).reverse()[0]; i++) {
            var rel = i;
            if (json[rel]['changes'] && json[rel]['changes'][change_key]) {
              html += '<p class="title">Release '+ rel +'</p>';
              html += '<ul>';
              html += '<li class="subtitle"><span class="colour-box" style="background-color:' + COLOURS[change_key] + '"></span>'+ change_key +'</li>';
              $.each(json[rel]['changes'][change_key], function(i, val) {
                html += '<ul class="changes">';
                val = val + ' <button type="button" class="btn btn-default btn-xs" data-type="'+ change_key +'" onClick=buttonClick(event,"'+rel+'");>'+ BUTTONS[change_key]['text'] +'</button><div class="image"></div>';
                html += '<li class="item">'+ val +'</li>';
                html += '</ul>';
              });
              html += '</ul>';
            }
          }
        }

        $('.results').html(html);

      });

      $('#dd_rel').on('change', function() {
        var current_type = $('#dd_types :selected').val();
        populateSelectBox($('#dd_types'), json, current_type);
        $('#dd_types').trigger('change');
      });

      $('#dd_rel').trigger('change');

      // $('#notification-message').on('show.bs.modal', function(e) {
      // });

    }
  });



});
