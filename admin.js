$(window).on('load', function () {
    populate_fields();
    load_options();
});


function get_columns(table) {
    $.ajax({
        url: "admin.php",
        method: "POST",
        data: {
            function: table
        }
    }).done(function (data) {
        data = JSON.parse(data);
        result = '';
        $(".options").append('<div class="row choice">' + table + '</div>');

        $.each(data["results"], function (index, value) {
            if (index % 3 == 0) {
                $(".options").append(result);
                result = '<div class="row">';
            }
            row = '<div class="col-md-4"><input type="checkbox" id="' + value + "__" + table +
                '" name="' + value + '" value="' + value +
                '"><label class="choice" for="' + value +
                '">' + value + '</label></div>';
            result = result.concat(row);
            if (data["results"].length % 3 != 0 && index + 1 == data["results"].length) {
                result = result.concat('</div>');
                $(".options").append(result);
            }
        });
    }).fail(function (error) {
        console.log("Failed to connect to data base!")
    });
}

function populate_fields() {
    get_columns("INV_ASSETS");
    get_columns("BUSINESS_UNITS");
    get_columns("INV_SUMMARY");
    get_columns("LOG_ASSETS");
    get_columns("LOG_JOBS");
    get_columns("LOG_MAINT");
    get_columns("RT_SUMMARY");
    get_columns("USER_PROFILE");
}

function load_options() {
    $.ajax({
        url: "config.php",
        method: "POST",
        data: {
            table: "inv_assets"
        }
    }).done(function (data) {
        config = JSON.parse(data);

        $.each(config, function (key, value) {
            $.each(config[key], function (index, value) {
                $('#' + value + "__" + key + '').prop('checked', true);
            });
        });
    }).fail(function (error) {
    });
}

function save_options() {
    accepted_fields = [];
    json_object = {};

    $("input:checkbox").each(function () {
        var $this = $(this);

        if ($this.is(":checked")) {
            accepted_fields.push($this.attr("id"));
        }
    });
    $.each(accepted_fields, function (index, value) {
        myArray = value.split("__");
        
        if (!(myArray[1] in json_object)) {
            json_object[myArray[1]] = [];
        }

        json_object[myArray[1]].push(myArray[0]);
    });

    console.log(json_object);

    $.ajax({
        url: "save_config.php",
        method: "POST",
        data: {
            update: JSON.stringify(json_object)
        }
    }).done(function (data) {
    }).fail(function (error) {
    });
}