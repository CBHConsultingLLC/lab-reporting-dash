function initialload(){
  showSection('reportsDiv');

  $('#reportsBtn').on('click',function(){
    showSection('reportsDiv');
  });

  $('#dashboardBtn').on('click',function(){
    showSection('dashboardDiv');
  });

  $('#settingsBtn').on('click',function(){
    showSection('settingsDiv');
  });

  $('#adminBtn').on('click',function(){
    showSection('adminDiv');
  });

  $('#promptToggleIcon').on('click',function(){
    toggleRptPrompts();
  });

  $('#workloadInfoBtn').on('click',function(){
    window.open('/assets/docs/helpDoc.html', '_blank');
  });

  $("#reportSelect,#startDate,#endDate,#stjrLocationRadio,#stjwLocationRadio,#allLocationRadio,#summaryLayoutRadio,#detailRadio").on('change',function(){
    formValidation();
  });

  $("#stjrDashLocationRadio,#stjwDashLocationRadio").on('change',function(){
    formDashValidation();
  });

  $("#downloadDetailSpreadsheetIcn").on('click',function(){
    downloadDetailTableDataToExcel();
  });

  $("#dailyEmailAddrBtn").on('click',function(){
    getUpdateSetting1();
  });

  document.getElementById('reportsBtn').click();

  $('#startDate,#endDate').datepicker({
    format:"dd-M-yyyy",
    todayBtn:"linked",
    todayHighlight:true,
    autoclose:true,
    clearBtn:true,
  }).datepicker("setDate", new Date());
}

function showSection(sectionId) {
  var sections = ['reportsDiv','dashboardDiv','settingsDiv','adminDiv'];
  var i;

  for (i = 0; i < sections.length; i++) {
    document.getElementById(sections[i]).style.display = sections[i] === sectionId ? 'block' : 'none';
  }

  var links = document.getElementsByClassName('nav-link');
  for (i = 0; i < links.length; i++) {
    links[i].className = links[i].className.replace(' active','');
  }

  event.currentTarget.className += ' active';
}
      
function formValidation(){
  var reportName = $("#reportSelect").val();
  var startDateObj = $('#startDate').datepicker('getDate');
  var stopDateObj = $('#endDate').datepicker('getDate');
  var facility = $('input[name="inlineFacilityOptions"]:checked').val();
  var reportType = $('input[name="inlineRadioOptions"]:checked').val();

/*
  if(reportName === "1_STJO_LAB_CANCEL_RPT" || reportName === "1_STJO_LAB_ED_LACTIC_RPT"){
    $('#summaryLayoutRadio').attr("disabled",true).attr("checked",false);
    document.getElementById('detailRadio').click();
  } else {
    $('#summaryLayoutRadio').attr("disabled",false);
  }
*/

  if(reportName != "" && facility !== "" && reportType != "" && startDateObj !== null && stopDateObj !== null){
    document.getElementById("submitRptBtn").disabled = false;
  } else {
    document.getElementById("submitRptBtn").disabled = true;
  }
}

function formDashValidation(){
  var facilitySelect = $('input[name="inlineDashFacilityOptions"]:checked').val();

  if(facilitySelect > 0){
    document.getElementById("submitDashBtn").disabled = false;
  } else {
    document.getElementById("submitDashBtn").disabled = true;
  }
}

function formatDateFields(dateObj){
  var inputDateMonth = dateObj.getMonth() + 1;
  var inputDateDay = dateObj.getDate();
				  
  if(inputDateMonth < 10){
    inputDateMonth = "0" + inputDateMonth.toString();
  } else {
    inputDateMonth = inputDateMonth.toString();
  }
				  
  if(inputDateDay < 10){
    inputDateDay = "0" + inputDateDay.toString();
  } else {
    inputDateDay = inputDateDay.toString();
  }
				    
  var finalDate = inputDateMonth + inputDateDay + dateObj.getFullYear().toString();
  return finalDate;
}

function formatDateDisplayFields(dateObj){
  var inputDateMonth = dateObj.getMonth() + 1;
  var inputDateDay = dateObj.getDate();
				  
  if(inputDateMonth < 10){
    inputDateMonth = "0" + inputDateMonth.toString();
  } else {
    inputDateMonth = inputDateMonth.toString();
  }
				  
  if(inputDateDay < 10){
    inputDateDay = "0" + inputDateDay.toString();
  } else {
    inputDateDay = inputDateDay.toString();
  }
				    
  var finalDate = inputDateMonth + "/" + inputDateDay + "/" + dateObj.getFullYear().toString();
  return finalDate;
}

function loadReport() {
  $('#loadingDiv').show();
  $("#tableDetailDiv,#tableSummaryDiv").hide();
  $("#currentReportDetails").text("");

  var reportName = $("#reportSelect").val();
  const reportDisplayName = $("#reportSelect option:selected").text();
  var startDateObj = $('#startDate').datepicker('getDate');
  var stopDateObj = $('#endDate').datepicker('getDate');
  var startDateStr = formatDateFields(startDateObj);
  var stopDateStr = formatDateFields(stopDateObj);
  var startDateDisp = formatDateDisplayFields(startDateObj);
  var stopDateDisp = formatDateDisplayFields(stopDateObj);
  var facility = $('input[name="inlineFacilityOptions"]:checked').val();
  var reportType = $('input[name="inlineRadioOptions"]:checked').val();

  let reportTypeId = 0;
  let reportParam = "";

  if(reportName === "1_STJO_LAB_ED_LACTIC_RPT"){
    reportTypeId = 7;
  } else if(reportName === "1_STJO_LAB_TAT_TECHS"){
    reportTypeId = 6;
  } else if(reportName === "1_STJO_LAB_VOLUME_RPT"){
    reportTypeId = 5;
  } else if(reportName === "1_STJO_LAB_CANCEL_RPT"){
    reportTypeId = 4;
  } else if(reportName === "1_STJO_LAB_STAT_TAT_DRV"){
    reportTypeId = 3;
  } else if(reportName === "1_STJO_LAB_CRIT_TAT_RPT"){
    reportTypeId = 2;
  } else {
    reportTypeId = 1;
  }

  if(reportTypeId === 1){
    reportParam = '^MINE^,^' + startDateStr + '^,^' + stopDateStr + '^,' + facility + ',' + reportType + ',' + 0;
  } else if(reportTypeId === 2){
    reportParam = '^MINE^,^' + startDateStr + '^,^' + stopDateStr + '^,' + facility + ',' + 0 + ',' + 0 + ',' + reportType;
  } else if(reportTypeId === 3){
    reportParam = '^MINE^,^' + startDateStr + '^,^' + stopDateStr + '^,' + facility + ',' + reportType + ',' + 0;
  } else if(reportTypeId === 4){
    reportParam = '^MINE^,^' + startDateStr + '^,^' + stopDateStr + '^,' + facility + ',^^,0,' + reportType + ',' + 0;
  } else if(reportTypeId === 5){
    reportParam = '^MINE^,^' + startDateStr + '^,^' + stopDateStr + '^,' + facility + ',' + reportType + ',' + 0;
  } else if(reportTypeId === 6){
    reportParam = '^MINE^,^' + startDateStr + '^,^' + stopDateStr + '^,' + facility + ',' + reportType + ',' + 0;
  } else if(reportTypeId === 7){
    reportParam = '^MINE^,^' + startDateStr + '^,^' + stopDateStr + '^,' + facility + ',' + reportType + ',' + 0;
  }

  $('#reportFrame').attr('src','');

  console.log(reportName + "|" + reportParam);

  var initsync = new XMLCclRequest();
  initsync.onreadystatechange = function() {
    if(initsync.readyState == 4 && initsync.status == 200){
      console.log(initsync.responseText);

      $('#reportFrame').attr('src','');
      $('#dashboard-sidebar,#loadingDiv').hide();

      if(typeof(rpttable) != "undefined"){
        rpttable.destroy();
      }

      if(reportType == 1){
        var binaryString = initsync.responseText;
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
                           
        for(var i = 0; i < binaryLen; i++){
            var ascii = binaryString.charCodeAt(i);
          bytes[i] = ascii;
        }

        var pdfBlob = new Blob([bytes],{type:'application/pdf'});
        var pdfUrl = window.URL.createObjectURL(pdfBlob);
        $("#reportFrame").attr("src", pdfUrl).fadeIn();
        $("#reportFrame,#tableSummaryDiv").show();
        $("#tableDetailDiv").hide();
		
      } else if(reportType == 2){
        let reportHeaderTitle = reportDisplayName;
        
        if(facility === "1"){
          reportHeaderTitle += " | Paterson | "
        } else if(facility === "2"){
          reportHeaderTitle += " | Wayne | "        
        } else if(facility === "3"){
          reportHeaderTitle += " | All | "        
        }

        reportHeaderTitle += startDateDisp + " to " + stopDateDisp;

        $("#currentReportDetails").html(reportHeaderTitle);

        var initjson = JSON.parse(initsync.responseText);
        $("#tableDetailDiv").show();
        $("#tableSummaryDiv").hide();

        if(reportTypeId === 1){
          initiateDetailTabulator01(initjson.AREC.QUAL);
        } else if(reportTypeId === 2){
          initiateDetailTabulator02(initjson.TREC.QUAL);
        } else if(reportTypeId === 3){
          initiateDetailTabulator01(initjson.AREC.QUAL);
        } else if(reportTypeId === 4){
          initiateDetailTabulator03(initjson.AREC.QUAL);
        } else if(reportTypeId === 5){
          initiateDetailTabulator04(initjson.AREC.QUAL);
        } else if(reportTypeId === 6){
          initiateDetailTabulator05(initjson.AREC.QUAL);
        } else if(reportTypeId === 7){
          initiateDetailTabulator06(initjson.TREC.QUAL);
        }
      }
    }
  }
  initsync.open("GET",reportName,1);
  initsync.send(reportParam);
}

function initiateDetailTabulator01(data){
  rpttable = new Tabulator("#mainTable",{
  data:data,
  placeholder:"No Data Found!",
  layoutColumnsOnNewData:true,
  layout:"fitDataFill",
  height:"75vh",
  maxHeight:"75vh",
  pagination:true,
  paginationCounter:"rows",
  virtualDom:true,
  movableColumns:true,
  columnDefaults:{
    tooltip:true,
  },
  columns: [
    {
      title:"Procedure",
      field:"PROCEDURE",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
     },
     {
       title:"Expected TAT",
       field:"EXPECTED_TAT",
       headerFilter:"list",
       headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
      },
     {
       title:"Accession",
       field:"ACCESSION",
       headerFilter:"list",
       headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
      },
     {
       title:"Order Date/Time",
       field:"ORDER_DT_TM",
      },
     {
       title:"Drawn Date/Time",
       field:"DRAWN_DT_TM",
      },
     {
       title:"In-Lab Date/Time",
       field:"INLAB_DT_TM",
      },
     {
       title:"Complete Date/Time",
       field:"COMPLETE_DT_TM",
      },
     {
       title:"Order To Drawn",
       field:"ORD_TO_DRAWN",
      },
     {
       title:"Drawn to In-Lab",
       field:"DRAWN_TO_INLAB",
      },
     {
       title:"In-Lab to Complete",
       field:"INLAB_TO_COMPLETE",
      },
     {
       title:"Order to Complete",
       field:"ORDER_TO_COMPLETE",
      },
     {
       title:"Perform Prsnl",
       field:"PERFORM_PRSNL",
       headerFilter:"list",
       headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
      },
     {
       title:"Verify Prsnl",
       field:"VERIFY_PRSNL",
       headerFilter:"list",
       headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
      },
     {
       title:"Outlier",
       field:"OUTLIER",
       headerFilter:"list",
       headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
      },
     {
       title:"Comments",
       field:"COMMENTS",
      },
    ]
  });
}

function initiateDetailTabulator02(data){
  rpttable = new Tabulator("#mainTable",{
  data:data,
  placeholder:"No Data Found!",
  layoutColumnsOnNewData:true,
  layout:"fitDataFill",
  height:"75vh",
  maxHeight:"75vh",
  pagination:true,
  paginationCounter:"rows",
  virtualDom:true,
  movableColumns:true,
  columnDefaults:{
    tooltip:true,
  },
  columns: [
    {
      title:"Procedure",
      field:"CATALOG_VC",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
       title:"Assay",
       field:"TASK_VC",
       headerFilter:"list",
       headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
       title:"Accession",
       field:"ACCESSION",
       headerFilter:"list",
       headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
       title:"Perform Date/Time",
       field:"PERFORM_DT_TM",
    },
    {
       title:"Verify Date/Time",
       field:"VERIFY_DT_TM",
    },
    {
       title:"Perform to Verify (min)",
       field:"PERF_TO_VERIFY",
    },
    {
       title:"Perform Prsnl",
       field:"PERFORM_PRSNL",
       headerFilter:"list",
       headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
       title:"Verify Prsnl",
       field:"VERIFY_PRSNL",
       headerFilter:"list",
       headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
       title:"Outlier",
       field:"OUTLIER",
       headerFilter:"list",
       headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
       title:"Comments",
       field:"COMMENTS",
    },
    ]
  });
}

function initiateDetailTabulator03(data){
  rpttable = new Tabulator("#mainTable",{
  data:data,
  placeholder:"No Data Found!",
  layoutColumnsOnNewData:true,
  layout:"fitDataFill",
  height:"75vh",
  maxHeight:"75vh",
  pagination:true,
  paginationCounter:"rows",
  virtualDom:true,
  movableColumns:true,
  columnDefaults:{
    tooltip:true,
  },
  columns: [
    {
      title:"Procedure",
      field:"PROCEDURE",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
      title:"Accession",
      field:"ACCESSION",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
      title:"Order Date/Time",
      field:"ORDER_DT_TM",
    },
    {
      title:"Cancel Date/Time",
      field:"CANCEL_DT_TM",
    },
    {
      title:"Cancel Prsnl",
      field:"CANCEL_PRSNL",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
      title:"Cancel Reason",
      field:"CANCEL_REASON",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
      title:"Comments",
      field:"COMMENTS",
    },
  ]
  });
}

function initiateDetailTabulator04(data){
  rpttable = new Tabulator("#mainTable",{
  data:data,
  placeholder:"No Data Found!",
  layoutColumnsOnNewData:true,
  layout:"fitColumns",
  height:"75vh",
  maxHeight:"75vh",
  pagination:true,
  paginationCounter:"rows",
  virtualDom:true,
  movableColumns:true,
  columnDefaults:{
    tooltip:true,
  },
  columns: [
    {
      title:"Section",
      field:"SECTION",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
      title:"Procedure",
      field:"PROCEDURE",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
      title:"Accession",
      field:"ACCESSION",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
      title:"Order Date/Time",
      field:"ORDER_DT_TM",
    },
    {
      title:"Complete Date/Time",
      field:"COMPLETE_DT_TM",
    },
  ]
  });
}

function initiateDetailTabulator05(data){
  rpttable = new Tabulator("#mainTable",{
  data:data,
  placeholder:"No Data Found!",
  layoutColumnsOnNewData:true,
  layout:"fitDataFill",
  height:"75vh",
  maxHeight:"75vh",
  pagination:true,
  paginationCounter:"rows",
  virtualDom:true,
  movableColumns:true,
  columnDefaults:{
    tooltip:true,
  },
  columns: [
    {
      title:"Personnel",
      field:"PRSNL",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
      title:"Position",
      field:"POSITION",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
      title:"Procedure",
      field:"PROCEDURE",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
      title:"Overall Average TAT (min)",
      field:"AVG_INLAB_TO_COMPLETE1",
    },
    {
      title:"Procedure Average TAT (min)",
      field:"AVG_INLAB_TO_COMPLETE2",
    },
    {
      title:"Accession",
      field:"ACCESSION",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
       title:"Order Date/Time",
       field:"ORDER_DT_TM",
    },
    {
       title:"Drawn Date/Time",
       field:"DRAWN_DT_TM",
    },
    {
       title:"In-Lab Date/Time",
       field:"INLAB_DT_TM",
    },
    {
       title:"Complete Date/Time",
       field:"COMPLETE_DT_TM",
    },
    {
       title:"Order To Drawn",
       field:"ORD_TO_DRAWN",
    },
    {
       title:"Drawn to In-Lab",
       field:"DRAWN_TO_INLAB",
    },
    {
       title:"In-Lab to Complete",
       field:"INLAB_TO_COMPLETE",
    },
    {
       title:"Order to Complete",
       field:"ORDER_TO_COMPLETE",
    },
    {
      title:"Comments",
      field:"COMMENTS",
    },
  ]
  });
}

function initiateDetailTabulator06(data){
  rpttable = new Tabulator("#mainTable",{
  data:data,
  placeholder:"No Data Found!",
  layoutColumnsOnNewData:true,
  layout:"fitDataFill",
  height:"75vh",
  maxHeight:"75vh",
  pagination:true,
  paginationCounter:"rows",
  virtualDom:true,
  movableColumns:true,
  columnDefaults:{
    tooltip:true,
  },
  columns: [
    {
      title:"Priority",
      field:"PRIORITY",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
      title:"Accession",
      field:"ACCESSION",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
      title:"MRN",
      field:"MRN",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
      title:"Name",
      field:"NAME",
      headerFilter:"list",
      headerFilterParams:{valuesLookup:"active",sort:"asc",clearable:true}
    },
    {
      title:"Order To Complete (hr:min)",
      field:"ORDER_TO_COMPLETE_HR",
    },
    {
      title:"Order To Complete (min)",
      field:"ORDER_TO_COMPLETE",
    },
    {
       title:"Order To Drawn",
       field:"ORDER_TO_DRAWN",
    },
    {
       title:"Drawn to In-Lab",
       field:"DRAWN_TO_INLAB",
    },
    {
       title:"In-Lab to Complete",
       field:"INLAB_TO_COMPLETE",
    },
    {
       title:"Order Date/Time",
       field:"ORDER_DT_TM",
    },
    {
       title:"Drawn Date/Time",
       field:"DRAWN_DT_TM",
    },
    {
       title:"In-Lab Date/Time",
       field:"INLAB_DT_TM",
    },
    {
       title:"Complete Date/Time",
       field:"COMPLETE_DT_TM",
    },
    ]
  });
}

function toggleRptPrompts() {
  $('#dashboard-sidebar').toggle();
}

function downloadDetailTableDataToExcel(){
  const reportFac = $('input[name="inlineFacilityOptions"]:checked').val();
  let reportSel = $("#reportSelect option:selected").text();
  reportSel = reportSel.toLowerCase();
  reportSel = reportSel.replace(/-/g,"");
  reportSel = reportSel.replace(/  /g," ");
  reportSel = reportSel.replace(/ /g,"_");

  let reportName = ""

  if(reportFac === "1"){
    reportName = reportSel + "_pater";
  } else if(reportFac === "2") {
    reportName = reportSel + "_wayne";
  } else if(reportFac === "3") {
    reportName = reportSel + "_all";
  }

  reportName += ".xlsx";
  rpttable.download("xlsx",reportName, {sheetName: "Data"});
}

function dashboardTable() {  
  var reportName = "1_STJO_LAB_QUEST_RPT_DASH";
  var facilitySelect = $('input[name="inlineDashFacilityOptions"]:checked').val();
  var reportParam = '^NL:^,' + facilitySelect;
  
  $("#dashboardTableDiv").empty();
  console.log(facilitySelect + "|" + reportParam);

  var initsync = new XMLCclRequest();
  initsync.onreadystatechange = function() {
    if(initsync.readyState == 4 && initsync.status == 200){
      console.log(initsync.responseText);

      $("#dashboardTableDiv").empty();
      const dashjson = JSON.parse(initsync.responseText);
      
      let roundedValue = 0;
      let backgroundColor = '';
      let dashTableStr = '<table id="dashTableMain" class="table table-sm" style="width:100%;">' +
                           '<thead>' +
                             '<tr>' + 
                               '<th tabulator-frozen="true" tabulator-headerSort="false">Metric</th>' +
                               '<th tabulator-frozen="true" tabulator-headerSort="false">Procedure</th>';


      for(var i = 0;i<dashjson.DREC.QUAL[0].YCNT;i++){
        for(var ii = 0;ii<dashjson.DREC.QUAL[0].YQUAL[i].MCNT;ii++){
          dashTableStr += '<th tabulator-hozAlign="center" tabulator-headerSort="false">' + dashjson.DREC.QUAL[0].YQUAL[i].MQUAL[ii].MONTH_VC + ' ' + dashjson.DREC.QUAL[0].YQUAL[i].YEAR + '</th>';
        }
      }

      dashTableStr += "</tr></thead><tbody>";

      for(var i = 0;i<dashjson.DREC.METRIC_CNT;i++){
        dashTableStr += '<tr>' +
                          '<td>' + dashjson.DREC.QUAL[i].METRIC + '</td>' +
                          '<td>' + dashjson.DREC.QUAL[i].PROCEDURE + '</td>';
        
        for(var ii = 0;ii<dashjson.DREC.QUAL[i].YCNT;ii++){
          for(var iii = 0;iii<dashjson.DREC.QUAL[i].YQUAL[ii].MCNT;iii++){
            roundedValue = dashjson.DREC.QUAL[i].YQUAL[ii].MQUAL[iii].VALUE * 100;
            roundedValue = roundedValue.toFixed(1); 
       
            dashTableStr += '<td data-highlight="' + dashjson.DREC.QUAL[i].YQUAL[ii].MQUAL[iii].HIGHLIGHT  + '">' + roundedValue + '%</td>';
          }
        }

        dashTableStr += '</tr>';
      }

      console.log(dashTableStr);

      $("#dashboardTableDiv").append(dashTableStr);
      var dashTable = new Tabulator("#dashTableMain",{
        htmlTable: true,
        layout:"fitDataFill",
        height:"75vh",
        maxHeight:"75vh",
      });
   
      dashTable.on("tableBuilt", function(){
        $('#dashTableMain .tabulator-cell').each(function(i, obj) {
          cellPercent = $(obj).text();
          cellPercent = cellPercent.slice(0,-1);
          cellPercent = parseFloat(cellPercent);

          if(!isNaN(cellPercent)){
            if(cellPercent < 70){
              obj.style.backgroundColor = "#FFCCCB";

            } else if(cellPercent >= 70 && cellPercent < 75){
              obj.style.backgroundColor = "lightYellow";

            } else if(cellPercent >= 75){
              obj.style.backgroundColor = "lightGreen";
            }
          }
          console.log(backgroundColor);
        });
      });
    }
  }
  initsync.open("GET",reportName,1);
  initsync.send(reportParam);
}

function getUpdateSetting1() {
  const reportName = "1_STJO_LAB_QUEST_RPT_DASH";
  const reportParam = "^NL:^,2";
  $("#settingsModalTitle").text("");
  $("#settingsModalBodyTableTbody").empty();

  console.log(reportName + "|" + reportParam);

  let setSync = new XMLCclRequest();
  setSync.onreadystatechange = function() {
    if(setSync.readyState == 4 && setSync.status == 200){
      let setSyncResp = JSON.parse(setSync.responseText);
      $("#settingsModalTitle").text("Daily Email Address Update");
      
      let settingsModalBodyTableTbody = "";

      for(let i = 0;i < setSyncResp.TREC.CNT1;i++){
        settingsModalBodyTableTbody += '<tr id="settingAddrTr1' + i + '">' + 
            '<td id="settingAddrTd1' + i + '" onblur="modifyEmailAddrBlur(' + i + ')">' + setSyncResp.TREC.QUAL1[i].ADDRESS + '</td>' +
            '<td style="text-align:center;"><i class="fa-solid fa-pen-to-square" style="cursor:pointer;" onclick="modifyEmailAddr('+ i +')"></i></td>' +
            '<td style="text-align:center;"><i class="fa-solid fa-trash-xmark" style="cursor:pointer;color:red;" onclick="removeEmailAddr('+ i +')"></i></td>' +
          '</tr>';
      }

      $("#settingsModalBodyTableTbody").append(settingsModalBodyTableTbody);
    }
  }
  setSync.open("GET",reportName,1);
  setSync.send(reportParam);
}

function addNewEmailAddr(){
  const currentAddrCnt = $('#settings1ModalTable tr').length - 1;
  const settingsModalBodyTableTbody = '<tr id="settingAddrTr1' + currentAddrCnt + '">' + 
            '<td id="settingAddrTd1' + currentAddrCnt + '" onblur="modifyEmailAddrBlur(' + currentAddrCnt + ')"></td>' +
            '<td style="text-align:center;"><i class="fa-solid fa-pen-to-square" style="cursor:pointer;" onclick="modifyEmailAddr('+ currentAddrCnt +')"></i></td>' +
            '<td style="text-align:center;"><i class="fa-solid fa-trash-xmark" style="cursor:pointer;color:red;" onclick="removeEmailAddr('+ currentAddrCnt +')"></i></td>' +
          '</tr>';

  $("#settingsModalBodyTableTbody").append(settingsModalBodyTableTbody);
}

function modifyEmailAddr(rowID){
  let selectedRowID = "#settingAddrTd1" + rowID;
  $(selectedRowID).attr('contenteditable','true').focus();
 console.log(selectedRowID);
}

function modifyEmailAddrBlur(rowID){
  let selectedRowID = "#settingAddrTd1" + rowID;
  const selectedRowEmail = $(selectedRowID).text();
  $(selectedRowID).attr('contenteditable','false');
}

function removeEmailAddr(rowID){
  let selectedRowID = "#settingAddrTr1" + rowID;
  $(selectedRowID).remove();
}

function submitUpdateSetting1() {
  const mainModalTable = document.getElementById('settings1ModalTable');
  const currentAddrCnt = mainModalTable.rows.length;

  let newAddrCnt = 0;
  let currentAddrStr = "";
  let currentIterPlaceholderObj = "";
  let currentIterPlaceholderTxt = "";

  for(let i = 1;i < currentAddrCnt;i++){
    currentIterPlaceholderTxt = mainModalTable.rows[i].cells[0].textContent;
    
    if(currentIterPlaceholderTxt.endsWith("@sjhmc.org") || currentIterPlaceholderTxt.endsWith("@sjhc.org")){
      newAddrCnt += 1;
      currentAddrStr += currentIterPlaceholderTxt + "|";
    }
  }

  const reportName = "1_STJO_LAB_QUEST_RPT_DASH";
  const reportParam = "^NL:^,3,^" + currentAddrStr + "^," + newAddrCnt;

  console.log(reportName + "|" + reportParam);

  let setSync = new XMLCclRequest();
  setSync.onreadystatechange = function() {
    if(setSync.readyState == 4 && setSync.status == 200){
      refreshUpdateSetting1();
      document.getElementById('closeSettingsModalBtn').click();
    }
  }
  setSync.open("GET",reportName,1);
  setSync.send(reportParam);
}

function refreshUpdateSetting1() {
  const reportName = "1_STJO_LAB_QUEST_RPT_DASH";
  const reportParam = "^NL:^,2";

  console.log(reportName + "|" + reportParam);

  let setSync = new XMLCclRequest();
  setSync.onreadystatechange = function() {
    if(setSync.readyState == 4 && setSync.status == 200){
      let setSyncResp = JSON.parse(setSync.responseText);
      
      let settingsBodyTableTbody = "";

      for(let i = 0;i < setSyncResp.TREC.CNT1;i++){
        settingsBodyTableTbody += '<li class="list-group-item">' + setSyncResp.TREC.QUAL1[i].ADDRESS + '</li>';
      }

      $("#setting1AccordBtnElement").text("Email Recipients (" + setSyncResp.TREC.CNT1 + ")");
      $("#setting1UlElement").empty().append(settingsBodyTableTbody);
    }
  }
  setSync.open("GET",reportName,1);
  setSync.send(reportParam);
}

function refreshDashboard(){
  var startDateObj = $('#startDateInpt').datepicker('getDate'),
      stopDateObj = $('#stopDateInpt').datepicker('getDate'),
      finalStartDate = formatDateFields(startDateObj),
      finalStopDate = formatDateFields(stopDateObj),
      refreshIntervalMin = $("#mainTableDiv").attr("rival"),
      refreshIntervalMs = parseInt(refreshIntervalMin)*60000,
      errorInd = $("#mainTableDiv").attr("errind");

  const pageRefresh = setTimeout(refreshDashboard,300000);
  reloadTableData(0,errorInd,finalStartDate,finalStopDate);
  window.external.PCUpdateRefreshTime();
}

