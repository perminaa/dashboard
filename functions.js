function inv_assets() {

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
	let queryEnd = " FROM dbo.INV_ASSETS"

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

	$('.results').html(loading);

	$.ajax({
		url: "fetch.php",
		method: "POST",
		data: {
			request: query,
			parameters: JSON.stringify(params)
		}
	}).done(function (data) {
		$('.results').html("");

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
		});

		$('#datatable tbody').on('click', 'tr', function () {
			$(this).toggleClass('selected');
		});

		$('#button').click(function () {
			alert(table.rows('.selected').data().length + ' row(s) selected');
		});

	}).fail(function (error) {
		console.log("Failed to connect to data base!")
	});
}

function jobs() {

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
	let queryEnd = " FROM dbo.LOG_JOBS"

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

	$('.results').html(loading);

	$.ajax({
		url: "fetch.php",
		method: "POST",
		data: {
			request: query,
			parameters: JSON.stringify(params)
		}
	}).done(function (data) {
		$('.results').html("");

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
		});

		$('#datatable tbody').on('click', 'tr', function () {
			$(this).toggleClass('selected');
		});

		$('#button').click(function () {
			alert(table.rows('.selected').data().length + ' row(s) selected');
		});

	}).fail(function (error) {
		console.log("Failed to connect to data base!")
	});
}

function retag() {

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
	let queryEnd = " FROM dbo.RT_SUMMARY"

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

	$('.results').html(loading);

	$.ajax({
		url: "fetch.php",
		method: "POST",
		data: {
			request: query,
			parameters: JSON.stringify(params)
		}
	}).done(function (data) {
		$('.results').html("");

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
		});

		$('#datatable tbody').on('click', 'tr', function () {
			$(this).toggleClass('selected');
		});

		$('#button').click(function () {
			alert(table.rows('.selected').data().length + ' row(s) selected');
		});

	}).fail(function (error) {
		console.log("Failed to connect to data base!")
	});
}

function lookup() {

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
	let queryEnd = " FROM dbo.INV_SUMMARY"

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

	$('.results').html(loading);

	$.ajax({
		url: "fetch.php",
		method: "POST",
		data: {
			request: query,
			parameters: JSON.stringify(params)
		}
	}).done(function (data) {
		$('.results').html("");

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
		});

		$('#datatable tbody').on('click', 'tr', function () {
			$(this).toggleClass('selected');
		});

		$('#button').click(function () {
			alert(table.rows('.selected').data().length + ' row(s) selected');
		});

	}).fail(function (error) {
		console.log("Failed to connect to data base!")
	});
}

function queue() {

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
	let queryEnd = " FROM dbo.LOG_MAINT"

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

	$('.results').html(loading);

	$.ajax({
		url: "fetch.php",
		method: "POST",
		data: {
			request: query,
			parameters: JSON.stringify(params)
		}
	}).done(function (data) {
		$('.results').html("");

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
		});

		$('#datatable tbody').on('click', 'tr', function () {
			$(this).toggleClass('selected');
		});

		$('#button').click(function () {
			alert(table.rows('.selected').data().length + ' row(s) selected');
		});

	}).fail(function (error) {
		console.log("Failed to connect to data base!")
	});
}

function units() {

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
	let queryEnd = " FROM dbo.BUSINESS_UNITS"

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

	$('.results').html(loading);

	$.ajax({
		url: "fetch.php",
		method: "POST",
		data: {
			request: query,
			parameters: JSON.stringify(params)
		}
	}).done(function (data) {
		$('.results').html("");

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
		});

		$('#datatable tbody').on('click', 'tr', function () {
			$(this).toggleClass('selected');
		});

		$('#button').click(function () {
			alert(table.rows('.selected').data().length + ' row(s) selected');
		});

	}).fail(function (error) {
		console.log("Failed to connect to data base!")
	});
}

function transactions() {

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
	let queryEnd = " FROM dbo.LOG_ASSETS"

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

	$('.results').html(loading);

	$.ajax({
		url: "fetch.php",
		method: "POST",
		data: {
			request: query,
			parameters: JSON.stringify(params)
		}
	}).done(function (data) {
		$('.results').html("");

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
		});

		$('#datatable tbody').on('click', 'tr', function () {
			$(this).toggleClass('selected');
		});

		$('#button').click(function () {
			alert(table.rows('.selected').data().length + ' row(s) selected');
		});

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