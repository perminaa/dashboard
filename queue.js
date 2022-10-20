$(window).on('load', function () {
    load_options();
});

function load_options() {
    $.ajax({
        url: "user_config.php",
        method: "POST",
        data: {
            table: "LOG_MAINT",
            filename: $('#files option:selected').val()
        }
    }).done(function (data) {
        $(".allresults").html("");
        config = JSON.parse(data);

        table=''

        $.each(config["LOG_MAINT_user"], function(index, value){
            if (index % 2 == 0){
                table = table.concat('<div class="row">');
            }

            row = '<div class="col-lg-6"><input class="checkboxAll" onclick="choice_check()" type="checkbox" id="' + value + 
            '_cb" name="'+ value + '_cb" value="' + value + '"><label class="choice" for="' + value + 
            '_cb">' + value + '</label><input type="text" class="form-control" id="' + value + 
            '" name="' + value + '"></div>';
            table = table.concat(row);

            if (index % 2 != 0){
                table = table.concat('</div>');
            }

            if (config["LOG_MAINT_user"].length % 2 != 0 && index+1 == config["LOG_MAINT_user"].length){
                table = table.concat('</div>');
            }
        });
        $(".allresults").prepend(table);
    }).fail(function (error) {
    });
}