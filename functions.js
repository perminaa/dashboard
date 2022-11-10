var selectAll = false;
var userSelected = [];
var userUnselected = [];
params = {};
var query;

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

function deselect_all_rows() {
	var table = $('#datatable').DataTable().draw();
	table.rows().deselect();
}

function server_side(selected_table, pk) {
	let selection = "";
	fields = [];
	header = '<table id="datatable" class="display" style="width:100%"><thead><tr>';

	// Extract chosen headers
	$('input[type=checkbox]').each(function () {
		if (this.checked && this.value != "selectall") {
			field = "#" + $(this).val();
			fields.push($(this).val());
			if ($(field).val() != "") {
				params[$(this).val()] = "%" + $(field).val() + "%";
			}
		}
	});

	if(!fields.includes(pk)){
		fields.unshift(pk);
	}

	fields.forEach(function(field) {
		header = header + "<th>" + field + "</th>";
		selection = selection.concat(" " + field + ",");
	});

	header = header + '</tr></thead></table><button type="button" ' + 
	'class="btn result_btn" onclick="exportcsv(\'' + selected_table + '\', \'' + pk + '\')">Export CSV</button>';

	// Make the query
	selection = selection.slice(0, -1)
	let queryStart = "SELECT";
	let queryEnd = " FROM " + selected_table;

	query = queryStart.concat(selection.concat(queryEnd));

	if (Object.keys(params).length > 0) {
		query = query.concat(" WHERE ");

		$.each(params, function (key, match) {
			query = query.concat(key + " LIKE ? AND ");
		});
		query = query.slice(0, -4);
		query = query.concat("");
	} else {
		query = query.concat("");
	}

	// console.log(query);
	// console.log(params);

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

	$(".container").toggleClass("results");
	$('.container').html(loading);

	$(".container").toggleClass("results");
	$('.results').html("");

	$('.results').append(header);

	var table = $('#datatable').DataTable({
		"processing": true,
		"serverSide": true,
		"bSort": false,
		"ajax": {
			"url": "server_processing.php",
			type: 'POST',
			data: {
				request: query,
				parameters: JSON.stringify(params),
				fields: JSON.stringify(fields),
				selected_table: selected_table
			}
        },
		rowId: [0],
		scrollX: true,
		scrollCollapse: true,
		scrollY: '60vh',
		scroller: {
            loadingIndicator: true
        },
		dom: 'Blfrtip',
		columnDefs: [
            {
                target: 0,
                visible: false,
            },
        ],
		buttons: [
			{
				text: 'Select All',
				action: function (e, dt, node, config) {
					selectAll = true;

					// Clear all user selections
					userSelected = [];
					userUnselected = [];
					dt.draw(false);
				}
			},
			{
				text: 'Deselect All',
				action: function (e, dt, node, config) {
					selectAll = false;

					// Clear all user selections
					userSelected = [];
					userUnselected = [];
					dt.draw(false);
				}
			}
		],
		select: {
			style: 'multi+shift'
		}
	});

	var rowsToSelect = [];
	var rowsToDeselect = [];

	table.on('draw', function () {


		if (selectAll === true) {

			// Select all rows on page unless it is user unselected
			rowsToSelect = table.rows().ids().toArray()
				.reduce(function (result, value) {
					value = '#' + value;
					if (userUnselected.indexOf(value) === -1) {
						result.push(value);
					}
					return result;
				}, []);

			// Clear deselect all id's
			rowsToDeselect = [];

		} else if (selectAll === false) {

			// deselect all rows on page unless its user selected
			rowsToDeselect = table.rows().ids().toArray()
				.reduce(function (result, value) {
					value = '#' + value;
					if (userSelected.indexOf(value) === -1) {
						result.push(value);
					}
					return result;
				}, []);

			// Clear select all id's
			rowsToSelect = [];

		}

		table.rows(rowsToSelect.concat(userSelected)).select();

		// Delay row deselctions to allow for DOM update of row().select()
		setTimeout(function () {
			table.rows(rowsToDeselect.concat(userUnselected)).deselect();
		}, 0);


		// Datatables removes our custom element if 0 records are displayed due to filtering
		if (table.page.info().recordsDisplay === 0) {
			var selected = 0;

			if (selectAll) {
				selected = table.page.info().recordsTotal - userUnselected.length;
			} else {
				selected = userSelected.length;
			}

			if (selected === 0) {
				$('.select-info').remove();
			} else {
				var rowsSelected = '1 row selected';
				if (selected > 1) {
					rowsSelected = selected + ' rows selected';
				}
				var span = '<span class="select-info">' +
					'<span class="select-item">' + rowsSelected + '</span>' +
					'</span>';
				$('.select-info').remove();
				$('#datatable_info').append($(span));
			}
		}
	});

	table.on('select deselect', function (e, dt, type, indexes) {


		var selected = 0;

		if (selectAll) {
			selected = table.page.info().recordsTotal - userUnselected.length;
		} else {
			selected = userSelected.length;
		}

		if (selected === 0) {
			$('.select-info').remove();
		} else {
			var rowsSelected = '1 row selected';
			if (selected > 1) {
				rowsSelected = selected + ' rows selected';
			}
			var span = '<span class="select-info">' +
				'<span class="select-item">' + rowsSelected + '</span>' +
				'</span>';
			$('.select-info').remove();
			$('#datatable_info').append($(span));
		}

	});



	table.on('user-select', function (e, dt, type, cell, originalEvent) {
		var id = '#' + table.row(cell.index().row).id();
		var selectedIndex = userSelected.indexOf(id);
		var unselectedIndex = userUnselected.indexOf(id);

		if (selectAll) {

			// Toggle user unselected
			if (unselectedIndex !== -1) {
				userUnselected.splice(unselectedIndex, 1);
			} else {
				userUnselected.push(id);
			}

			// Remove from user selected
			if (selectedIndex !== -1) {
				userSelected.splice(selectedIndex, 1);
			}
		} else {

			// Toggle user selected
			if (selectedIndex !== -1) {
				userSelected.splice(selectedIndex, 1);
			} else {
				userSelected.push(id);
			}

			// Remove from unselected
			if (unselectedIndex !== -1) {
				userUnselected.splice(unselectedIndex, 1);
			}

		}
	});
}

function exportcsv(selected_table, pk) {
	if (selectAll) {
		userSelection = userUnselected;
		console.log("Excluding these ids:")
		console.log(userSelection);
	} else {
		userSelection = userSelected;
		console.log("Including these ids:")
		console.log(userSelection);
	}

	$.ajax({
        url: "exportcsv.php",
        method: "POST",
		data: {
			selectAll: selectAll,
			rows: JSON.stringify(userSelection),
			request: query,
			parameters: JSON.stringify(params),
			selected_table: selected_table,
			pk: pk
		}
    }).done(function (data) {
		// var element = document.createElement('a');
  		// element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
  		// element.setAttribute('download', 'results.csv');

  		// element.style.display = 'none';
  		// document.body.appendChild(element);

  		// element.click();

 		// document.body.removeChild(element);
    }).fail(function (error) {
    });
}