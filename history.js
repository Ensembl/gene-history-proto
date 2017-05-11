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

$(document).ready(function () {
    var dataArray = 
{
    "89": {
        "date": {
            "month": "6",
            "year": "2017"
        },
        "changes": {
            "Updated transcript": ["FOXP2-202(ENST00000403559)"]
        }
    },

    "88": {
        "date": {
            "month": "3",
            "year": "2017"
        },
        "changes": {
            "New transcript": ["FOXP2-004(ENST00000408937)"],
            "Retired transcript": ["ENST0034"]
        }
    },

    "83": {
        "date": {
            "month": "12",
            "year": "2015"
        },
        "changes": {
            "New transcript": ["ENST0003"],
            "Retired transcript": ["ENST00010"]
        }
    },

    "76": {
        "date": {
            "month": "8",
            "year": "2014"
        },
        "changes": {
            "Sequence changed": ["ENST00342", "ENST000231", "ENST1111"],
            "New transcript": ["ENST0008", "ENST0001"],
            "Assembly change": "GRCH38"
        }
    },

    "75": {
        "date": {
            "month": "2",
            "year": "2014"
        },
        "changes": {
            "New transcript": ["ENST0032", "ENT00132"]
        }
    }
}
    var dd_changes = $('#dd_changes');
    var dd_rel = $('#dd_rel');
    populateSelectBox(dd_changes, dd_rel, dataArray);
});