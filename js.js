/*==================================== For Common ===========================================*/


//To Get Current Time Upto milliseconds

function Time() {

    var dTime = new Date();
    var hours = dTime.getHours();
    var minute = dTime.getMinutes();
    var seconds = dTime.getSeconds();
    var period = "AM";
    if (hours > 12) {
        period = "PM"
    }
    else {
        period = "AM";
    }
    hours = ((hours > 12) ? hours - 12 : hours);
    return hours + ":" + minute + ":" + seconds + " " + period;
}

/*==========================================================================================*/



/*==================================== For Profile ===========================================*/

function GetDate() {

    var dDate = new Date();
    localStorage.ProfileLabel = "Last Updated Time: " + dDate.toDateString() + " " + dDate.toLocaleTimeString();
    document.getElementById("updated").innerHTML = "Last Updated Time: " + dDate.toDateString() + " " + dDate.toLocaleTimeString();
}

function ClearData() {

    document.getElementById("userName").value = "";
    document.getElementById("oldPassWord").value = "";
    document.getElementById("changePassword").value = "";
    document.getElementById("reenterPassword").value = "";

}

/*==========================================================================================*/

/*==================================== For Server ===========================================*/

function Reset() {
    document.getElementById("server").value = "127.0.0.1";
    document.getElementById("port").value = "80";
    localStorage.ServerAddress = "127.0.0.1";
    localStorage.PortAddress = "80";
}

function SetSettings() {
    var server = document.getElementById("server").value;
    var port = document.getElementById("port").value;
    localStorage.ServerAddress = server;
    localStorage.PortAddress = port;
    alert("Settings save as" + server + ":" + port);
}

/*==========================================================================================*/


/*==================================== For LoginValidation From Server =================================*/

var handlerForScada = 'http://192.168.1.22:80/Handler/ScadaHandler.ashx';

function signin(username, password, method, ip, port, token, callback) {        /* Method For Authentication  */
    $.ajax({
        type: 'GET',
        url: handlerForScada,
        dataType: 'json',
        data: { Username: username, Password: password, Method: method, IP: ip, Port: port, Token: token },
        success: function (data) {
            token = data;
            callback(data);
        },
        error: function (data) {
            alert("Signin Failed");
        }
    });
}
/*==========================================================================================*/


//===============================================  Overview from server ===============
function OverviewClick() {
    document.getElementById("overviewtime").innerHTML = " Last Updated Time : " + Time();
    //document.getElementById("OverviewDataSlider").selectedIndex = "1";
    //var val = localStorage.Group;
    if (localStorage.Group == 1) {
        method = "GetDigitalData";
    }
    else {
        method = "GetAnalogData";
    }

    userName = localStorage.username;
    passWord = localStorage.password;
    server = localStorage.ServerAddress;
    port = localStorage.PortAddress;
    token = localStorage.tok;


    GetGroup(userName, passWord, method, server, port, token, function (data) {         /* Bind  Data to select menu*/
        $('#OverviewSelectList').append('<select name="OverviewList" id="OverviewList" class="ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow"  aria-haspopup="true" data-rel="popup" class="ui-select" onchange="GetListDataForOverview()">');
        $('#OverviewList').append('<option value="0"> -- Select From List -- </option>');
        var i = 0;
        for (i in data.Nm) {
            $('#OverviewList').append('<option value="' + data.Id[i] + '">' + data.Nm[i] + '</option>');
        };
        $('#OverviewSelectList').append('</select>');

        //=================================================================
        method = "OAlarmDetail";
        var ts = new Date();
        ts = ts.getTime() - 7 * 24 * 60 * 60 * 1000;
        var id = -1, size = 5, type = -99;

        if (localStorage.getItem('Number')) {
            size = localStorage.Number;
        }
        else {
            size = 5;
        }

        if (localStorage.getItem('Type') && localStorage.Type == 1 || localStorage.Type == 0 || localStorage.Type == -99) {
            type = localStorage.Type;
        }
        else {
            type = -99;
        }


        GetODetail(userName, passWord, method, server, port, token, id, ts, size, type, function (data) {

            $('#OverviewDiv').empty();
            // $('#OverviewDiv').append('<label id="overviewlabel">Alarms</label>');
            $('#OverviewDiv').append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-filter="true" data-inset="true" data-role="listview" id="OUList">');
            // $('#OUList').append('<li class="ui-li-divider ui-bar-inherit ui-first-child" data-role="list-divider" role="heading">' + Name + '</li>');

            for (i in data.TN) {
                var date = DateConversion(data.TS[i]);

                if (data.STS[i] == "LL ALARM") {
                    $('#OUList').append('<li id="lowlow" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }
                else if (data.STS[i] == "L ALARM") {
                    $('#OUList').append('<li id="low" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp;& <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }
                else if (data.STS[i] == "H ALARM") {
                    $('#OUList').append('<li id="high" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }
                else if (data.STS[i] == "HH ALARM") {
                    $('#OUList').append('<li id="highhigh" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }
                else {
                    $('#OUList').append('<li id="other" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }

                if (data.TS[i] < ts) {
                    ts = data.TS[i];
                }
            }
            $('#OverviewDiv').append('</ul>');
        });
        var interval = 0;

        if (localStorage.getItem('TimeInterval')) {
            interval = setInterval(function () { ts = OverviewAlarm(ts) }, localStorage.TimeInterval);
        }
        else {
            interval = setInterval(function () { ts = OverviewAlarm(ts) }, 5000);
        }

        $('#OverviewHome').click(function () {
            clearInterval(interval);
            $('#OverviewUL').empty();
            $('#OverviewSelectList').empty();
            $.mobile.changePage("#AdminPage");
        });
    });


    function OverviewAlarm(timeStamp) {
        document.getElementById("overviewtime").innerHTML = " Last Updated Time : " + Time();
        method = "OAlarmDetail";
        var id = -1;
        var size = 5;
        var type = -99;
        if (localStorage.getItem('Number')) {
            size = localStorage.Number;
        }
        else {
            size = 5;
        }

        if (localStorage.getItem('Type') && localStorage.Type == 1 || localStorage.Type == 0 || localStorage.Type == -99) {
            type = localStorage.Type;
        }
        else {
            type = -99;
        }

        GetODetail(userName, passWord, method, server, port, token, id, timeStamp, size, type, function (data) {

            $('#OverviewDiv').empty();
            //$('#OverviewDiv').append('<label id="overviewlabel">Alarms</label>');
            $('#OverviewDiv').append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-filter="true" data-inset="true" data-role="listview" id="OUList">');
            for (i in data.TN) {
                var date = DateConversion(data.TS[i]);

                if (data.STS[i] == "LL ALARM") {
                    $('#OUList').append('<li id="lowlow" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }
                else if (data.STS[i] == "L ALARM") {
                    $('#OUList').append('<li id="low" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp;& <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }
                else if (data.STS[i] == "H ALARM") {
                    $('#OUList').append('<li id="high" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }
                else if (data.STS[i] == "HH ALARM") {
                    $('#OUList').append('<li id="highhigh" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }
                else {
                    $('#OUList').append('<li id="other" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }


                if (data.TS[i] < timeStamp) {
                    timeStamp = data.TS[i];
                }
            }
            $('#OverviewDiv').append('</ul>');
        });
        return timeStamp;
    }


    $('#OverviewDataSlider').change(function () {
        var value = document.getElementById("OverviewDataSlider").value;        /* Check for Digital or Analog Option 1 For Digital and 0 For Analog Here*/
        if (value == 1) {
            $('#OverviewUL').empty();
            method = "GetDigitalData";
            GetGroup(userName, passWord, method, server, port, token, function (data) {         /* Bind Digital Data to select menu*/
                $('#OverviewList').empty();
                $('#OverviewList').append('<option value="0"> -- Select From List -- </option>');
                var i = 0;
                for (i in data.Nm) {
                    $('#OverviewList').append('<option value="' + data.Id[i] + '">' + data.Nm[i] + '</option>');
                };
            });
        }
        else {                                                      /* Bind Analog Data to Select Option*/
            $('#OverviewUL').empty();
            method = "GetAnalogData";
            GetGroup(userName, passWord, method, server, port, token, function (data) {
                $('#OverviewList').empty();
                $('#OverviewList').append('<option value="0"> -- Select From List -- </option>');
                var i = 0;
                for (i in data.Nm) {
                    $('#OverviewList').append('<option value="' + data.Id[i] + '">' + data.Nm[i] + '</option>');
                };
            });
        }
    });

    $.mobile.changePage("#OverviewPage");
}

function GetListDataForOverview() {
    var Id = document.getElementById("OverviewList").value;

    if (Id == 0) {
        $('#OverviewUL').empty();
    }
    else {
        var temp = document.getElementById("OverviewList");
        var Name = temp.options[temp.selectedIndex].text;
        method = "GetData";
        GetIVData(userName, passWord, method, server, port, token, Id, function (data) {
            $('#OverviewUL').empty();
            $('#OverviewUL').append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-filter="true" data-inset="true" data-role="listview" id="OList">');
            $('#OList').append('<li class="ui-li-divider ui-bar-inherit ui-first-child" data-role="list-divider" role="heading">' + Name + '</li>');
			 $('#OList').append('<li id="tabular" class="listClass ui-li-static ui-body-inherit"><table><tr><td style="text-align:left;"><b>TagName</b></td><td style="text-align:right;"><b>PV</b></td></tr></table></li>');
            var i = 0;
            for (i in data.TN) {
               // $('#OList').append('<li id="tabular" class="listClass ui-li-static ui-body-inherit">' + "<b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>PV&nbsp;=&nbsp;</b>" + data.PV[i] + '</li>');
			    $('#OList').append('<li id="tabular" class="listClass ui-li-static ui-body-inherit"><table><tr><td style="text-align:left; width:20px;">' + data.TN[i] + '</td><td style="text-align:right; width:20px;">' + data.PV[i] + '</td></tr></table></li>');
            }
            $('#OverviewUL').append('</ul>');
        });
    }
}

function GetODetail(username, password, method, ip, port, token, id, ts, size, type, callback) {     //to get detail for selected group
    $.ajax({
        type: 'GET',
        url: handlerForScada,
        dataType: 'json',
        data: { Username: username, Password: password, Method: method, Ip: ip, Port: port, Token: token, ID: id, TimeStamp: ts, Size: size, TYPE: type },
        success: function (data) {
            callback(data);
        },
        error: function (data) {
            alert("Failed to Load Overview Detail");
        }
    });
}

function SaveSettings() {
    var group = document.getElementById("ovgroup").value;
    var type = document.getElementById("ovtype").value;
    var num = document.getElementById("ovnumber").value

        localStorage.Group = group;
        localStorage.Type = type;
        localStorage.Number = num;
        document.getElementById("OverviewDataSlider").selectedIndex = localStorage.Group;
        alert("Change Successfully");
   
  //      alert("Please Enter All Detail");
  
}

function ResetSettings() {
    localStorage.Group = 0;
    localStorage.Type = -99;
    localStorage.Number = 3;
    alert("Reset Successfully");
}
//=================================== Tabular from server ===================

function TabularClick() {                                               /* Trigger on click Tabular button from admin page*/


    //method = "GetDigitalData";
    userName = localStorage.username;
    passWord = localStorage.password;
    server = localStorage.ServerAddress;
    port = localStorage.PortAddress;
    token = localStorage.tok;

    var value = document.getElementById("DataSlider").value;
    if (value == 1) {
        method = "GetDigitalData";
        GetGroup(userName, passWord, method, server, port, token, function (data) {         /* Bind Digital Data to select menu*/
            $('#SelectList').append('<select name="TabularList" id="TabularList" class="ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow"  aria-haspopup="true" data-rel="popup" class="ui-select" onchange="GetListData()">');
            $('#TabularList').append('<option value="0"> -- Select From List -- </option>');
            var i = 0;
            for (i in data.Nm) {
                $('#TabularList').append('<option value="' + data.Id[i] + '">' + data.Nm[i] + '</option>');
            };
            ('#SelectList').append('</select>');
        });
    }
    else {
        method = "GetAnalogData";
        GetGroup(userName, passWord, method, server, port, token, function (data) {         /* Bind Digital Data to select menu*/
            $('#SelectList').append('<select name="TabularList" id="TabularList" class="ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow"  aria-haspopup="true" data-rel="popup" class="ui-select" onchange="GetListData()">');
            $('#TabularList').append('<option value="0"> -- Select From List -- </option>');
            var i = 0;
            for (i in data.Nm) {
                $('#TabularList').append('<option value="' + data.Id[i] + '">' + data.Nm[i] + '</option>');
            };
            ('#SelectList').append('</select>');
        });
    }
    $('#DataSlider').change(function () {
        var value = document.getElementById("DataSlider").value;        /* Check for Digital or Analog Option 1 For Digital and 0 For Analog Here*/
        if (value == 1) {
            $('#UL').empty();
            method = "GetDigitalData";
            GetGroup(userName, passWord, method, server, port, token, function (data) {         /* Bind Digital Data to select menu*/
                $('#TabularList').empty();
                $('#TabularList').append('<option value="0"> -- Select From List -- </option>');
                var i = 0;
                for (i in data.Nm) {
                    $('#TabularList').append('<option value="' + data.Id[i] + '">' + data.Nm[i] + '</option>');
                };

            });
        }
        else {                                                      /* Bind Analog Data to Select Option*/

            $('#UL').empty();
            method = "GetAnalogData";
            GetGroup(userName, passWord, method, server, port, token, function (data) {

                $('#TabularList').empty();
                $('#TabularList').append('<option value="0"> -- Select From List -- </option>');
                var i = 0;
                for (i in data.Id) {
                    $('#TabularList').append('<option value="' + data.Id[i] + '">' + data.Nm[i] + '</option>');
                };

            });
        }
    });
    $.mobile.changePage("#TabularPage");
}


function GetListData() {
    var Id = document.getElementById("TabularList").value;
    if (Id == 0) {
        $('#UL').empty();
    }
    else {
        var temp = document.getElementById("TabularList");
        var Name = temp.options[temp.selectedIndex].text;
        method = "GetData";
        GetIVData(userName, passWord, method, server, port, token, Id, function (data) {
            $('#UL').empty();
            $('#UL').append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-filter="true" data-inset="true" data-role="listview" id="List">');
            $('#List').append('<li class="ui-li-divider ui-bar-inherit ui-first-child" data-role="list-divider" role="heading">' + Name + '</li>');
            $('#List').append('<li id="tabular" class="listClass ui-li-static ui-body-inherit"><table><tr><td style="text-align:left;"><b>TagName</b></td><td style="text-align:right;"><b>PV</b></td></tr></table></li>');
            var i = 0;
            for (i in data.TN) {
                $('#List').append('<li id="tabular" class="listClass ui-li-static ui-body-inherit"><table><tr><td style="text-align:left; width:20px;">' + data.TN[i] + '</td><td style="text-align:right; width:20px;">' + data.PV[i] + '</td></tr></table></li>');
                //$('#List').append('<li id="tabular" class="listClass ui-li-static ui-body-inherit">' + "<b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>PV&nbsp;=&nbsp;</b>" + data.PV[i] + '</li>');
                //        $('#List').append('<li  class="listClass ui-li-static ui-body-inherit">' + "<b>PV=</b>" + data["PV"] + '</li>');
                //        $('#List').append('<li  class="listClass ui-li-static ui-body-inherit">' + "<b>TagID=</b>" + data["TID"] + '</li>');
            }
            $('#UL').append('</ul>');
        });
    }
}

function TabularAdmin() {
    $('#SelectList').empty();
    $('#UL').empty();
    $.mobile.changePage("#AdminPage");
}



function GetGroup(username, password, method, ip, port, token, callback) {          /*  To Get Group Data From Server On Slider Change*/
    $.ajax({
        type: 'GET',
        url: handlerForScada,
        dataType: 'json',
        data: { Username: username, Password: password, Method: method, IP: ip, Port: port, Token: token },
        success: function (data) {
            callback(data);
        },
        error: function (data) {
            alert("Failed To Load Tabular Data");
        }
    });
}


function GetIVData(username, password, method, ip, port, token, index, callback) {
    $.ajax({                                                                /* Get IV for Selected Group From selection Menu*/
        type: 'GET',
        url: handlerForScada,
        dataType: 'json',
        data: { Username: username, Password: password, Method: method, Ip: ip, Port: port, Token: token, Index: index },
        success: function (data) {
            callback(data);
        },
        error: function (data) {
            alert("Error While Load IV Data");
        }
    });
}

/*==========================================================================================*/


/*============================== For Trend data from server ================================*/
function TrendClick() {                                                  /* get devices list on click of TrendDetail button*/

    method = "Device";
    userName = localStorage.username;
    passWord = localStorage.password;
    server = localStorage.ServerAddress;
    port = localStorage.PortAddress;
    token = localStorage.tok;


    GetDevice(userName, passWord, method, server, port, token,function(data){
	
	$('#DeviceDiv').empty();
            $('#TagDiv').empty();
            $('#DeviceDiv').append('<select id="DeviceList"  class="ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow"  aria-haspopup="true" data-rel="popup" class="ui-select">');
            $('#DeviceList').append('<option value= "0"> -- Select From List -- </option>');
            $.each(data, function () {

                $('#DeviceList').append('<option>' + this['DeviceName'] + '</option>');
            });
            $('#DeviceDiv').append('</select>');



            $('#DeviceList').change(function () {                   /* Change Tag Value According to Device Selection and bind to Selection menu*/
                var values = document.getElementById("DeviceList").value;
                $('#TagLabel').remove();
                $('#TagDiv').append('<label for="TagList" id="TagLabel">Select Tag</label>');
                if (values != 0) {
                    $.each(data, function () {
                        if (this['DeviceName'] == values) {
                            var deviceId = this['DeviceID'];
                            method = "GetTagByDevice";
                            TagByDeviceID(userName, passWord, method, server, port, token, deviceId, function (data) {
                                $('#TagList').remove();

                                $('#TagDiv').append('<div id="TagList" class="multiselect" class=" ui-corner-all ui-shadow"  class="ui-select">');
                                $.each(data, function () {
                                    $('#TagList').append('<input class="chk" type="checkbox" value="' + this['TagID'] + '" /><label>' + this['TagName'] + '</label>');
                                });
                                $('#TagDiv').append('</div>');
                            });
                        }
                    });
                }
                else {
                    $('#TagList').remove();
                }
            });	
	});
    $.mobile.changePage("#TrendPage");
}


function GetDevice(username, password, method, ip, port, token, callback) {         /*  Get Device List From Server*/

    $.ajax({
        type: 'GET',
        url: handlerForScada,
        dataType: 'json',
        data: { Username: username, Password: password, Method: method, IP: ip, Port: port, Token: token },
        success: function (data) {
            callback(data);
        },
        error: function (data) {
            alert("Failed TO Get Device List");
        }
    });
}


function TagByDeviceID(username, password, method, ip, port, token, deviceID, callback) {
    $.ajax({                                                        /* Get Tags From Selected Device using DeviceID*/
        type: 'GET',
        url: handlerForScada,
        dataType: 'json',
        data: { Username: username, Password: password, Method: method, IP: ip, Port: port, Token: token, DeviceID: deviceID },
        success: function (data) {
            callback(data);
        },
        error: function (data) {
            alert("Error While Load Tag/s For Selected Device");
        }
    });
}
/*==========================================================================================*/




/*=============================== For Profile from server ===================================*/

function ProfileClick() {
    $.mobile.changePage("#ProfilePage");
}

function Change() {
    var uname = document.getElementById("userid").value;
    var oldpass = document.getElementById("oldPassWord").value;
    var npass = document.getElementById("changePassword").value;
    var rpass = document.getElementById("reenterPassword").value;
    var time = document.getElementById("TimeInterval").value;

    if (localStorage.getItem('TimeInterval') && time > 0)
        localStorage.TimeInterval = time * 1000;
    else
        localStorage.TimeInterval = 5000;

    if (npass == rpass) {

        method = "changepassword";
        userName = localStorage.username;
        passWord = localStorage.password;
        server = localStorage.ServerAddress;
        port = localStorage.PortAddress;
        token = localStorage.tok;


        ChangePassword(userName, passWord, method, server, port, token, uname, oldpass, npass, function (data) {
            alert("Change Successfully");
            GetDate();
        });
    }
    else {
        alert("Please enter same password for new and re-enter password");
    }
}

function ChangePassword(username, password, method, ip, port, token, uname, oldpass, npass, callback) {
    $.ajax({
        type: 'GET',
        url: handlerForScada,
        dataType: 'json',
        data: { Username: username, Password: password, Method: method, Ip: ip, Port: port, Token: token, UserID: uname, OldPass: oldpass, NewPass: npass },
        success: function (data) {
            callback(data);
        },
        error: function (data) {
            alert("Failed To Change");
        }
    });
}
/*==========================================================================================*/


/*=============================== For Audit from server ===================================*/

function AuditClick() {                                                  /* get AuditConfig on click of Audit button*/
    var Action_id = document.getElementById("AuditList").value;
    var Action_from = document.getElementById("ActionFrom").value;
    var Action_till = document.getElementById("ActionTill").value;

    if (Action_id != "" && Action_from != "" && Action_till != "") {
        localStorage.Action = Action_id;
        localStorage.ActionFrom = Action_from;
        localStorage.ActionTill = Action_till;

        $('#AuditUL').empty();

        userName = localStorage.username;
        passWord = localStorage.password;
        server = localStorage.ServerAddress;
        port = localStorage.PortAddress;
        token = localStorage.tok;
        Action_id = localStorage.Action;
        Action_from = localStorage.ActionFrom;
        Action_till = localStorage.ActionTill;

        method = "AuditConfig";
        Audit(userName, passWord, method, server, port, token, Action_id, Action_from, Action_till, function (data) {
            //$('#auditDetailContent').empty();
            //$('#auditDetailContent').append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-filter="true" data-inset="true" data-role="listview" id="AuditUL">');
            $.each(data, function () {
                var ad = DateConversion(this['ActionDate']);
                //var at = DateConversion(this['ActionTime']);
                $('#AuditUL').append('<li id="audit" class="listClass ui-li-static ui-body-inherit"><table style="width:100%;"><tr><td><b>ActionDate </b></td><td>' + ad + '</td><td><b>Space </b></td><td>' + this['SpaceName'] + '</td></tr><tr><td><b>Action </b></td><td>' + this['Action'] + '</td><td><b>Value </b></td><td>' + this['Value'] + '</td></tr><tr><td><b>Item </b></td><td>' + this['Item'] + '</td><td><b>ActionBy </b></td><td>' + this['ActionBy'] + '</td></tr></table></li>');
            });
            //$('#auditDetailContent').append('</ul>');

        });
        $.mobile.changePage("#AuditDetailPage");
    }
    else {
        alert("Please Enter All Details");
    }
}

function Audit(username, password, method, ip, port, token, id, Afrom, Atill, callback) {
    $.ajax({
        type: 'GET',
        url: handlerForScada,
        dataType: 'json',
        data: { Username: username, Password: password, Method: method, Ip: ip, Port: port, Token: token, ACTIONID: id, AFROM: Afrom, ATILL: Atill },
        success: function (data) {
            callback(data);
        },
        error: function (data) {
            alert("Error While Load Data");
        }
    });
}
/*==========================================================================================*/

/*============== Convert into date and time from server's timestamp ========================*/

function DateConversion(timestamp) {
    var d = new Date(parseInt(timestamp.substr(6)));
    var formattedDate = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
    var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
    var seconds = (d.getSeconds() < 10) ? "0" + d.getSeconds() : d.getSeconds();
    var formattedTime = hours + ":" + minutes + ":" + seconds;
    formattedDate = formattedDate + " " + formattedTime;
    return formattedDate;
}

function TimeConversion(timestamp) {
    var d = new Date(parseInt(timestamp.substr(6)));
    var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
    var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
    var seconds = (d.getSeconds() < 10) ? "0" + d.getSeconds() : d.getSeconds();
    var formattedTime = hours + ":" + minutes + ":" + seconds;
    return formattedTime;
}

/*==========================================================================================*/


/*================================= For Alarm from server =======================================*/

function AlarmClick() {            //On click alarm button from admin panel generate selection list of alarm group
    $('#alarmtime').empty();
    document.getElementById("alarmtime").innerHTML = " Last Updated Time : " + Time();
    method = "GetGroups";

    userName = localStorage.username;
    passWord = localStorage.password;
    server = localStorage.ServerAddress;
    port = localStorage.PortAddress;
    token = localStorage.tok;

    GetGroups(userName, passWord, method, server, port, token, function (data) {
	    $('#alarmUL').empty();
        $('#alarmSelection').empty();
        $('#alarmSelection').append('<select name="alarmList" id="alarmList" class="ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow"  aria-haspopup="true" data-rel="popup" class="ui-select" onchange="GetAlarmDetail()">');
        $('#alarmList').append('<option value="0"> -- Select From Alarm Group -- </option>');
        for (var i in data.Id) {
            $('#alarmList').append('<option value="' + data.Id[i] + '">' + data.Nm[i] + '</option>');
        };
    });
    $('#alarmSelection').append('</select>');
    $.mobile.changePage("#AlarmPage");

};

function GetGroups(username, password, method, ip, port, token, callback) {     //to get alarm groups from server
    $.ajax({
        type: 'GET',
        url: handlerForScada,
        dataType: 'json',
        data: { Username: username, Password: password, Method: method, Ip: ip, Port: port, Token: token },
        success: function (data) {
           			callback(data);
        },
        error: function (data) {
            alert("Not Able To Load Alarm Groups");
        }
    });
}

function GetAlarmDetail() {
    var id = document.getElementById("alarmList").value;

    $('#alarmUL').empty();
    $('#alarmtime').empty();
    document.getElementById("alarmtime").innerHTML = " Last Updated Time : " + Time();
    clearInterval(Interval);

    if (id == 0) {
        clearInterval(Interval);
        $('#alarmUL').empty();
    }
    else {
        var temp = document.getElementById("alarmList");
        var Name = temp.options[temp.selectedIndex].text;


        method = "AlarmDetail";

        var today = new Date();
        today = today.getTime() - 7 * 24 * 60 * 60 * 1000;

        var ts = today, size = 20;

        GetDetail(userName, passWord, method, server, port, token, id, today, size, function (data) {

            $('#alarmUL').empty();
            $('#alarmUL').append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-filter="true" data-inset="true" data-role="listview" id="alarmUList">');
            $('#alarmUList').append('<li class="ui-li-divider ui-bar-inherit ui-first-child" data-role="list-divider" role="heading">' + Name + '</li>');

            today = '/Date(' + today + ')/';


            for (i in data.TN) {
                var date = DateConversion(data.TS[i]);

                if (data.STS[i] == "LL ALARM") {
                    $('#alarmUList').append('<li id="lowlow" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp;<br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }
                else if (data.STS[i] == "L ALARM") {
                    $('#alarmUList').append('<li id="low" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp;<br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }
                else if (data.STS[i] == "H ALARM") {
                    $('#alarmUList').append('<li id="high" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp;<br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }
                else if (data.STS[i] == "HH ALARM") {
                    $('#alarmUList').append('<li id="highhigh" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp;<br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }
                else {
                    $('#alarmUList').append('<li id="other" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp;<br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }


                if (data.TS[i] < today) {
                    today = data.TS[i];
                }
            }
            today = parseInt(today.substr(6));

            $('#alarmUL').append('</ul>');

        });
        var Interval = 0;
        if (localStorage.getItem('TimeInterval')) {
            Interval = setInterval(function () { today = setAlarms(today); }, localStorage.TimeInterval);
        }
        else {
            Interval = setInterval(function () { today = setAlarms(today); }, 5000);
        }
    }

    $('#AlarmHome').click(function () {
        clearInterval(Interval);
    });
}


function setAlarms(today) {
    var size = 20;

    document.getElementById("alarmtime").innerHTML = " Last Updated Time : " + Time();
    var id = document.getElementById("alarmList").value;
    var temp = document.getElementById("alarmList");
    var Name = temp.options[temp.selectedIndex].text;


    method = "AlarmDetail";


    GetDetail(userName, passWord, method, server, port, token, id, today, size, function (data) {
        if (id == 0) {
            $('#alarmUL').empty();
        }
        else {
            $('#alarmUL').empty();
            $('#alarmUL').append('<ul class="ui-listview ui-listview-inset ui-corner-all ui-shadow" data-filter="true" data-inset="true" data-role="listview" id="alarmUList">');
            $('#alarmUList').append('<li class="ui-li-divider ui-bar-inherit ui-first-child" data-role="list-divider" role="heading">' + Name + '</li>');

            today = '/Date(' + today + ')/';


            for (i in data.TN) {
                var date = DateConversion(data.TS[i]);

                if (data.STS[i] == "LL ALARM") {
                    $('#alarmUList').append('<li id="lowlow" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp;<br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }
                else if (data.STS[i] == "L ALARM") {
                    $('#alarmUList').append('<li id="low" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp;<br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }
                else if (data.STS[i] == "H ALARM") {
                    $('#alarmUList').append('<li id="high" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp;<br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }
                else if (data.STS[i] == "HH ALARM") {
                    $('#alarmUList').append('<li id="highhigh" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp;<br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }
                else {
                    $('#alarmUList').append('<li id="other" class="listClass ui-li-static ui-body-inherit" onclick = "GetPopupAlarmDetail(' + data.AID[i] + ',' + data.AP[i] + ',' + data.MS[i] + ',' + data.PR[i] + ',' + data.PV[i] + ',' + data.SP[i] + ',' + data.TID[i] + ',\'' + data.MSG[i] + '\', \'' + data.STS[i] + '\',\'' + data.ISACK[i] + '\',\'' + data.TS[i] + '\')" >' + "<b>AlarmID&nbsp;=&nbsp;</b>" + data.AID[i] + "&nbsp;&nbsp;&nbsp;&nbsp; <b>TagName&nbsp;=&nbsp;</b>" + data.TN[i] + "&nbsp;&nbsp;&nbsp;&nbsp;<br/> <b>Time Stamp&nbsp;=&nbsp;</b>" + date + '</li>');
                }

                if (data.TS[i] < today) {
                    today = data.TS[i];
                }
            }
            today = parseInt(today.substr(6));

            $('#alarmUL').append('</ul>');
        }
    });
    return today;
}

function GetDetail(username, password, method, ip, port, token, id, ts, size, callback) {     //to get detail for selected group
    $.ajax({
        type: 'GET',
        url: handlerForScada,
        dataType: 'json',
        data: { Username: username, Password: password, Method: method, Ip: ip, Port: port, Token: token, ID: id, TimeStamp: ts, Size: size },
        success: function (data) {
            callback(data);
        },
        error: function (data) {
            alert("Failed To Get Detail For Selected Alarm");
        }
    });
}

function GetPopupAlarmDetail(aid, ap, ms, pr, pv, sp, tid, msg, sts, ack, ts) {
    //            $('#detail').empty();
    //            $('#detail').append('<ul data-role="listview" data-inset="true" id="detailUL">');
    //            $('#detailUL').append('<li><b>AlarmID : </b>' + aid + '</li><li><b>AP : </b>' + ap + '</li><li><b>MS : </b>' + ms + '</li><li><b>PR : </b>' + pr + '</li><li><b>PV : </b>' + pv + '</li><li><b>SP : </b>' + sp + '</li><li><b>TID : </b>' + tid + '</li><li><b>MSG : </b>' + msg + '</li><li><b>STS : </b>' + sts + '</li><li><b>ACK : </b>' + ack + '</li>');
    //            $('#detail').append('</ul>');
    //$('#ackBtn').remove();


    document.getElementById("alarmid").innerHTML = aid;
    //    document.getElementById("apid").innerHTML = ap;
    //    document.getElementById("msid").innerHTML = ms;
    //    document.getElementById("prid").innerHTML = pr;
    //    document.getElementById("spid").innerHTML = sp;
    document.getElementById("pvid").innerHTML = pv;
    document.getElementById("Tid").innerHTML = tid;
    document.getElementById("msgid").innerHTML = msg;
    document.getElementById("stsid").innerHTML = sts;
    document.getElementById("ackid").innerHTML = ack;

    if (ack == "false") {
        var d = new Date()
        var offset = d.getTimezoneOffset();
        ts = parseInt(ts.substr(6));
        $('#btn').empty();
        $('#btn').append('<input type="button" id="ackBtn" data-rel="back" name="Acknowledge" value="Acknowledge" onclick = "AcknowledgeAlarm(' + aid + ',' + ts + ',' + offset + ',' + ms + ')"  class="ui-btn ui-input-btn ui-corner-all ui-shadow ui-icon-check ui-btn-icon-right"/>');
    }
    else {
        $('#btn').empty();
    }
    $.mobile.changePage("#AlarmDetailPage");
}


function AcknowledgeAlarm(aid, ts, offset, ms) {
    method = "Acknowledge";
    $.ajax({
        type: 'GET',
        url: handlerForScada,
        dataType: 'json',
        data: { Username: userName, Password: passWord, Method: method, Ip: server, Port: port, Token: token, AlarmID: aid, TimeStamp: ts, Offset: offset, MilliSecond: ms },
        success: function (data) {
            alert(data);
        },
        error: function (data) {
            alert("Not Able To Acknowledge");
        }
    });

}
/*==========================================================================================*/

/*============================== For Trend data from server ================================*/
function ReportClick() {                                                  /* get devices list on click of TrendDetail button*/

    method = "Device";
    userName = localStorage.username;
    passWord = localStorage.password;
    server = localStorage.ServerAddress;
    port = localStorage.PortAddress;
    token = localStorage.tok;


    GetDeviceForReport(userName, passWord, method, server, port, token,function(data){
	$('#RDeviceDiv').empty();
            $('#RTagDiv').empty();
            $('#RDeviceDiv').append('<select id="RDeviceList"  class="ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow"  aria-haspopup="true" data-rel="popup" class="ui-select">');
            $('#RDeviceList').append('<option value= "0"> -- Select From List -- </option>');
            $.each(data, function () {

                $('#RDeviceList').append('<option>' + this['DeviceName'] + '</option>');
            });
            $('#RDeviceDiv').append('</select>');



            $('#RDeviceList').change(function () {                   /* Change Tag Value According to Device Selection and bind to Selection menu*/
                var values = document.getElementById("RDeviceList").value;
                $('#RTagLabel').remove();
                $('#RTagDiv').append('<label for="RTagList" id="RTagLabel">Select Tag</label>');
                if (values != 0) {
                    $.each(data, function () {
                        if (this['DeviceName'] == values) {
                            var deviceId = this['DeviceID'];
                            localStorage.DeviceID = this['DeviceName'];
                            method = "GetTagByDevice";
                            TagByDeviceID(userName, passWord, method, server, port, token, deviceId, function (data) {
                                $('#RTagList').remove();

                                $('#RTagDiv').append('<div id="RTagList" class="multiselect" class=" ui-corner-all ui-shadow"  class="ui-select">');
                                $.each(data, function () {
                                    $('#RTagList').append('<input class="rchk" type="checkbox" value="' + this['TagID'] + '" /><label>' + this['TagName'] + '</label>');
                                });
                                $('#RTagDiv').append('</div>');
                            });
                        }
                    });
                }
                else {
                    $('R#TagList').remove();
                }
            });	
	});
    $.mobile.changePage("#ReportPage");
}


function GetDeviceForReport(username, password, method, ip, port, token, callback) {         /*  Get Device List From Server*/

    $.ajax({
        type: 'GET',
        url: handlerForScada,
        dataType: 'json',
        data: { Username: username, Password: password, Method: method, IP: ip, Port: port, Token: token },
        success: function (data) {
            callback(data);
        },
        error: function (data) {
            alert("Error While Load Devices");
        }
    });
}

function Report() {
    var TagId = [], items = 0, TagName = [];
    Data = [];
    $(".rchk:checked").each(function () {
        TagId.push($(this).val());
        TagName.push($(this).next('label').text());
        items++;
    });

    $('#DetailFieldContent').empty();

    method = "GetTag";
    $.ajax({
        type: 'GET',
        url: handlerForScada,
        dataType: 'json',
        data: { Username: userName, Password: passWord, Method: method, IP: server, Port: port, Token: token, TagID: JSON.stringify(TagId) },
        success: function (data) {
            items = 0;
            $('#DetailFieldContent').append('<table id="ReportTable" border=1 >');
            $('#ReportTable').append('<tr><th colspan="2">' + localStorage.DeviceID + '</th></tr>');
            for (var i in data.PV) {
                var date = DateConversion(data.TS[i]);
                $('#ReportTable').append('<tr><td colspan="2"> Tag Number ' + items++ + '</td></tr>');
                $('#ReportTable').append('<tr><td><b> Name and Id</b></td><td>' + data.TN[i] + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.TID[i] + '</td></tr>');
                // $('#ReportTable').append('<tr class="alter"><td><b> ID </b></td><td>' + data.TID[i] + '</td></tr>');
                $('#ReportTable').append('<tr><td><b> Present Value </b></td><td>' + data.PV[i] + ',&nbsp;&nbsp;Max&nbsp;:&nbsp;' + data.Mx[i] + ',&nbsp;&nbsp;Min&nbsp;:&nbsp;' + data.Mn[i] + '</td></tr>');
                //$('#ReportTable').append('<tr class="alter"><td><b> Minimum Value </b></td><td>' + data.Mn[i] + '</td></tr>');
                //$('#ReportTable').append('<tr><td><b> Maximum Value </b></td><td>' + data.Mx[i] + '</td></tr>');
                $('#ReportTable').append('<tr class="alter"><td><b> Last Update </b></td><td>' + date + '</td></tr>');
                //$('#ReportTable').append('<tr><td><b> Preveliouge </b></td><td>' + data.PR[i] + '</td></tr>');
                //$('#ReportTable').append('<tr class="alter"><td><b> Request </b></td><td>' + data.RQ[i] + '</td></tr>');
                $('#ReportTable').append('<tr><td><b> Unit </b></td><td>' + data.U[i] + '</td></tr>');
                //$('#ReportTable').append('<tr class="alter"><td><b> MilliSecond </b></td><td>' + data.Ms[i] + '</td></tr>');
                // $('#ReportTable').append('<tr><td><b> Description </b></td><td>' + data.DS[i] + '</td></tr>');               
            }
            $('#DetailFieldContent').append('</table>');
            $.mobile.changePage("#ReportDetailPage");
        },
        error: function (data) {
            alert("Not Able To Prepare Report");
        }
    });
    $('#ReportDetailAdmin').click(function () {
        items = 0;
        window.location.replace('#AdminPage');
    });
}



function PrintPage() {

	$('#DetailFieldContent').print();
	
    //var printContent = document.getElementById("DetailFieldContent");
    //var windowUrl = 'about:blank';

    //var num;
    //var uniqueName = new Date();

    //var windowName = 'Print' + uniqueName.getTime();
    //var printWindow = window.open(num, windowName, 'left=50000,top=50000,width=0,height=0');
    //var cssReference = printWindow.document.createElement("link")
    //cssReference.href = "../css/mystyles.css"; //include real path like "CSS/CSSFileName.css"
    //cssReference.rel = "stylesheet";
    //cssReference.type = "text/css";

    //printWindow.document.write(printContent.outerHTML);
    //printWindow.document.getElementsByTagName('head')[0].appendChild(cssReference);

    //printWindow.document.close();
    //printWindow.focus();
    //printWindow.print();
    //printWindow.close();
}

/*==========================================================================================*/
