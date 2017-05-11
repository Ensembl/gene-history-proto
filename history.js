var historyURL = 'https://ens-hsr.github.io/gene-history-proto/data/history.json.js';

var populateSelectBox = function (dd_changes, dd_rel, dataArray) {
        var changes = {};
    $.each(dataArray, function (k) {
        $.each(dataArray[k].changes, function(ch) {
                changes[ch]++;
      })
    });

        Object.keys(dataArray).forEach(function(rel) {
            dd_rel.append("<option>Since release " + rel + "</option>");    
    })
        Object.keys(changes).forEach(function(change) {
            dd_changes.append("<option>" + change + "</option>");    
    })
};


$(document).on('ready', function() {
  $.ajax({
    url: historyURL,
    dataType: 'json',
    success: function (json) {
      addHistorySVG(json, $('._svg_container'));
      populateSelectBox($('#dd_changes'), $('#dd_rel'), json);
    }
  });
});
