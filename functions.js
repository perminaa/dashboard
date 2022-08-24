function pull_data(selected_table) {

	let selection = "";
	params = {};

	$('input[type=checkbox]').each(function () {
		if (this.checked && this.value != "selectall") {
			selection = selection.concat(" " + $(this).val() + ",");
			field = "#" + $(this).val();
			if ($(field).val() != "") {
				params[$(this).val()] = "%" + $(field).val() + "%";
			}
		}
	});

	selection = selection.slice(0, -1)
	let queryStart = "SELECT";
	let queryEnd = " FROM " + selected_table;

	let query = queryStart.concat(selection.concat(queryEnd));

	if (Object.keys(params).length > 0) {
		query = query.concat(" WHERE ");

		$.each(params, function (key, match) {
			query = query.concat(key + " LIKE ? AND");
		});
		query = query.slice(0, -4);
		query = query.concat(";");
	} else {
		query = query.concat(";");
	}

	console.log(query);
	console.log(params);

	loading = `<div class='loader'>
	<div class='loader_overlay'></div>
	<div class='loader_cogs'>
	  <div class='loader_cogs__top'>
		<div class='top_part'></div>
		<div class='top_part'></div>
		<div class='top_part'></div>
		<div class='top_hole'></div>
	  </div>
	  <div class='loader_cogs__left'>
		<div class='left_part'></div>
		<div class='left_part'></div>
		<div class='left_part'></div>
		<div class='left_hole'></div>
	  </div>
	  <div class='loader_cogs__bottom'>
		<div class='bottom_part'></div>
		<div class='bottom_part'></div>
		<div class='bottom_part'></div>
		<div class='bottom_hole'></div>
	  </div>
	  <p class="loading"><b>loading</p>
	</div>
  </div>`;

	export_buttons = `
	<div class="container">
	<div class="row">
	<div class="col-lg-3 copybutton">
	</div>
	<div class="col-lg-3 csvbutton">
	</div>
	<div class="col-lg-3 excelbutton">
	</div>
	<div class="col-lg-3 pdfbutton">
	</div>
	</div>
	</div>
	`;

	$(".container").toggleClass("results");
	$('.container').html(loading);

	$.ajax({
		url: "fetch.php",
		method: "POST",
		data: {
			request: query,
			parameters: JSON.stringify(params)
		}
	}).done(function (data) {
		$(".container").toggleClass("results");
		$('.results').html("");
		console.log(data);
		data = JSON.parse(data);

		header = '<table id="datatable" class="display" style="width:100%"><thead><tr>';

		$.each(data["results"][0], function (key, value) {
			header = header.concat("<td>" + key + "</td>")
		});

		header = header.concat("</tr></thead><tbody id='data'>");

		$('.results').append(header);

		$.each(data["results"], function (index, value) {
			row = '<tr>';

			$.each(value, function (key, match) {
				row = row.concat("<td>" + match + "</td>");
			});
			row = row.concat("</tr>");
			$('#data').append(row);

		});

		var table = $('#datatable').DataTable({
			scrollX: true,
			scrollCollapse: true,
			scrollY: '60vh',
			dom: 'Blfrtip',
			buttons: [
				{ extend: 'copy', className: 'copyButton'},
				{ extend: 'csv', className: 'csvButton'},
				{ extend: 'excel', className: 'excelButton'},
				{ extend: 'pdf', className: 'pdfButton'}
			],
			select: {
				style: 'multi+shift'
			}
		});
		
		$('.results').append(export_buttons);

		table.buttons().container().appendTo($('.results'));
		var copy = $('.copyButton').detach();
		$('.copybutton').append(copy);

		var csv = $('.csvButton').detach();
		$('.csvbutton').append(csv);

		var excel = $('.excelButton').detach();
		$('.excelbutton').append(excel);

		var pdf = $('.pdfButton').detach();
		$('.pdfbutton').append(pdf);

	}).fail(function (error) {
		console.log("Failed to connect to data base!")
	});
}

$(document).ready(function () {
	$("#selectall").click(function () {
		if (this.checked) {
			$('.checkboxAll').each(function () {
				$(".checkboxAll").prop('checked', true);
			})
		} else {
			$('.checkboxAll').each(function () {
				$(".checkboxAll").prop('checked', false);
			})
		}
	});
});

function choice_check() {
	if ($('#selectall').is(':checked')) {
		$('#selectall').prop('checked', false);
	}
}

function select_all_rows() {
	var table = $('#datatable').DataTable().draw();
	table.rows().select();
}