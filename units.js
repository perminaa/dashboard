$(window).on('load', function () {
    load_options();
});

function load_options() {
    $.ajax({
        url: "config.php",
        method: "GET",
        data: {
            table: "BUSINESS_UNITS"
        }
    }).done(function (data) {
        config = JSON.parse(data);

        table=''

        $.each(config["BUSINESS_UNITS"], function(index, value){
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

            if (config["BUSINESS_UNITS"].length % 2 != 0 && index+1 == config["BUSINESS_UNITS"].length){
                table = table.concat('</div>');
            }
        });
        $(".results").prepend(table);
    }).fail(function (error) {
    });
}