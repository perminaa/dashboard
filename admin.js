$(window).on('load', function () {
    populate_fields();
    load_options();
    test_connection();
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
    setTimeout(get_columns, 100, "INV_ASSETS");
    setTimeout(get_columns, 200, "BUSINESS_UNITS");
    setTimeout(get_columns, 300, "INV_SUMMARY");
    setTimeout(get_columns, 400, "LOG_ASSETS");
    setTimeout(get_columns, 500, "LOG_JOBS");
    setTimeout(get_columns, 600, "LOG_MAINT");
    setTimeout(get_columns, 700, "RT_SUMMARY");
    setTimeout(get_columns, 800, "USER_PROFILE");
}

function load_options() {
    $.ajax({
        url: "config.php/",
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
    $('.modal').modal('toggle');
}

function update_data() {
    $(".loading").show();
    $.ajax({
        url: "update_data.php",
        method: "POST",
    }).done(function (data) {
        alert("Updated Completed!");
        $(".loading").hide();
    }).fail(function (error) {
        alert("Updated Failed!");
        $(".loading").hide();
    });
}

function test_connection() {
    $(".loading").show();
    $.ajax({
        url: "test_connection.php",
        method: "POST",
    }).done(function (data) {
        data = JSON.parse(data);
        $("#connection_Data").html("");

        $.each(data["results"], function (index, value) {
            if (value.con_status == 'Success') {
                $("#connection_Data").append(`<tr><td>${value.server_name}</td><td>${value.table_name}</td><td>&#128994; ${value.con_status}</td><td>${value.connection_id}</td><td><button class="btn btn-danger" type="button" onClick="remove_connection('${value.server_name}','${value.table_name}')">Delete</button></td></tr>`);
            } else {
                $("#connection_Data").append(`<tr><td>${value.server_name}</td><td>${value.table_name}</td><td>&#128308; ${value.con_status}</td><td>${value.connection_id}</td><td><button class="btn btn-danger" type="button" onClick="remove_connection('${value.server_name}','${value.table_name}')">Delete</button></td></tr>`);
            }
        });
        $(".loading").hide();
    }).fail(function (error) {
    });

}

function add_connection() {
    if ($("#server").val() == "") {
        alert("Server field cannot be empty!");
    } else if ($("#database").val() == "") {
        alert("Database field cannot be empty!");
    } else if ($("#username").val() == "") {
        alert("Username field cannot be empty!");
    } else if ($("#password").val() == "") {
        alert("Password field cannot be empty!");
    } else {
        $.ajax({
            url: "add_connection.php",
            method: "POST",
            data: {
                server: $("#server").val(),
                database: $("#database").val(),
                username: $("#username").val(),
                password: $("#password").val()
            }
        }).done(function (data) {
            test_connection();
            $("#server").val("");
            $("#database").val("");
            $("#username").val("");
            $("#password").val("");
        }).fail(function (error) {
            $("#server").val("");
            $("#database").val("");
            $("#username").val("");
            $("#password").val("");
        });
    }
}

function remove_connection(input_server, input_database) {
    if (input_server == "") {
        alert("Server field cannot be empty!");
    } else if (input_database == "") {
        alert("Database field cannot be empty!");
    } else {
        console.log(input_server);
        console.log(input_database);
        $.ajax({
            url: "remove_connection.php",
            method: "POST",
            data: {
                server: input_server,
                database: input_database
            }
        }).done(function (data) {
            console.log(data);
            test_connection();
        }).fail(function (error) {
        });
    }
}

