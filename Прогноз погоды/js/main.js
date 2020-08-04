$(document).ready(function() {
    $("#tabs").tabs();
    $(".location__counrty").html($("#country-change option:selected").html());

    
    function getRequest() {
        
        $(".location__city").html($("#city option:selected").html());

        $.getJSON("./current.city.list.json", function(data) {
            $("#country-change").on("change", function () {
            $(".location__counrty").html($("#country-change option:selected").html());
            var out = "";
            for(var key in data) {
                if(data[key].country==$("#country-change option:selected").val()) {
                out += `<option value="${data[key].id}">${data[key].name}</option>`;
                }
            }
            $("#city").html(out);
            
            
           
            $("#city").on("click", getRequest);
    
            });
        });
        $.get(
            "http://api.openweathermap.org/data/2.5/forecast",
            {
                "q": $("#city option:selected").html() + "," + $("#country-change option:selected").val(),
                "appid": "765d4b04d523ef3ec636b57484e5cb1a"
            },
            function (data) {
                let out = "";
                function weatherFiveDays(a, i) {
                      // ветер
                    $(".tabs-" + a +"-weather__wind span").html(data.list[i].wind.speed);
                    // давление
                    $(".tabs-" + a +"-weather__pressure span").html(Math.round(data.list[i].main.pressure*0.00750063755419211*100));
                    // Влажность
                    $(".tabs-" + a +"-weather__temp span").html(data.list[i].main.humidity);

                    // Температура 
                    out = Math.round(data.list[i].main.temp-273);
                    if(out > 0) {
                        $(".tabs-" + a +"-degrees p span").html("+" + out);
                    } else if (out < 0) {
                        $(".tabs-" + a +"-degrees p span").html("-" + out);
                    } else {
                        $(".tabs-" + a +"-degrees p span").html(out);
                    }

                    // Осадки
                    $(".tabs-" + a +"-weather__main span").html(data.list[i].weather[0].main);
                    $(".tabs-" + a +"-weather__icon img").attr("src", "./img/weather/" + data.list[i].weather[0].icon + ".png");
                    $(".tabs-1" + a + "-weather").html(data.list[i].weather[0].main);
                    console.log(data);
                }
                weatherFiveDays(2, 0);
                weatherFiveDays(1, 8);
                weatherFiveDays(3, 16);
                weatherFiveDays(4, 24);
                weatherFiveDays(5, 32);

                //Дата
                function setDate(index, num) {
                    let day = data.list[index].dt_txt;
                    let month = "January";   
                    if(day[5] == "0") {
                        if(day[6] == "1") {
                            month = " January";
                        } else if(day[6] == "2") {month = " February"}
                        else if(day[6] == "3") {month = " March"}
                        else if(day[6] == "4") {month = " April"}
                        else if(day[6] == "5") {month = " May"}
                        else if(day[6] == "6") {month = " June"}
                        else if(day[6] == "7") {month = " July"}
                        else if(day[6] == "8") {month = " August"}
                        else if(day[6] == "9") {month = " September"}
                    } else {
                        if(day[6] == "0") {
                            {month = " October"}
                        } else if(day[6] == "1") {month = " November"}
                        else if(day[6] == "2") {month = " December"}
                    }
                    $(".tabs-2-menu__time"+num).html(day[8] + day[9] + month);
                };
                setDate(0, 1);
                setDate(8, 2);
                setDate(16, 3);
                setDate(24, 4);
                setDate(32, 5);

                function weatherHourly(n) {
                    for(let i = 1; i <= 6; i++) {
                        // осадки каждій час первій день
                        $(".tabs-0_table_icon" + i +" div").html(data.list[n].weather[0].main);
                        $(".tabs-0_table_icon" + i +" img").attr("src", "./img/weather/" + data.list[n].weather[0].icon + ".png");
                        // температура осадки каждый час первый день
                        out = Math.round(data.list[n].main.temp-273);
                        if(out > 0) {
                            $(".tabs-0_table_temp"+i).html("+" + out);
                        } else if (out < 0) {
                            $(".tabs-0_table_temp"+i).html("-" + out);
                        } else {
                            $(".tabs-0_table_temp"+i).html(out);
                        }
                        // ветер первый день
                        $(".tabs-0_table_wind"+i).html(data.list[n].wind.speed);
                        //время для почасово
                        let time = data.list[n].dt_txt;
                        $(".tabs-0_table_time"+i).html(time[11] + time[12] + time[13]+time[14]+time[15]);
                        
                        n++;
                    } 
                };
                weatherHourly(0);
                $("#tabs-4-link, #tabs-7-link").click(function() {
                    weatherHourly(0);
                });
                $("#tabs-5-link, #tabs-8-link").click(function() {
                    weatherHourly(7);
                });
                $("#tabs-6-link, #tabs-9-link").click(function() {
                    weatherHourly(15);
                });
                $("#tabs-10-link").click(function() {
                    weatherHourly(23);
                });
                $("#tabs-11-link").click(function() {
                    weatherHourly(31);
                });
                console.log(data);

            }
        )
        }
        
        getRequest(city);
});