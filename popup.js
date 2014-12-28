        var background = chrome.extension.getBackgroundPage();

        function pintaCuentayTiempo()
        {
            var div_tiempo = document.getElementById('mensaje');
            div_tiempo.innerHTML = (getCuentaTotal());

        }

        function getCuentaTotal()
        {
            return (background.contador_visitas + " pages opened since<br/> " + formatDate(background.tiempo_inicio));

        }

        function formatDate(aDate)
        {
            return aDate.getFullYear() + "/" + (aDate.getMonth()+1) + "/" + aDate.getDate()
        }

            //Resets start time
            function resetCounter()
            {
                if(confirm('This will reset everything to 0 and you will lost your progress, are you sure?'))
                {
                    if(confirm("really really sure?"))
                    {
                        background.tiempo_inicio = new Date();
                        background.contador_visitas = 0;
                        localStorage.PC_tiempo_acumulado = 0;
                        background.tiempo_acumulado = 0;
                        background.start_timer = new Date();
                        background.badge();
                        background.guardaEstadisticas();    //Resets Stats

                        window.location.reload();
                    }
                }
      
            }
            
            function pintaEstadisticas()
            {
                var div_estadisticas = document.getElementById('stats');

                var visitas_por_hora = (background.contador_visitas / Math.max(1,ms2Hours(background.getAcumulado())));
                var visitas_por_minuto = (background.contador_visitas / Math.max(1,ms2Minutes(background.getAcumulado())));
                var visitas_por_dia = (background.contador_visitas / Math.max(1,ms2Days(background.getAcumulado())));

                var contenido = "";


                contenido+=("Real Time in Use: "+ background.formatTime(background.getAcumulado()) + "<br />");

                contenido+=("<center><table>");


                contenido+=("<tr><td style='text-align:right'>" + cutFromPoint(visitas_por_hora.toString(),2)+ "</td><td>per hour</td></tr>");
                contenido+=("<tr><td style='text-align:right'>" + cutFromPoint(visitas_por_minuto.toString(),2)+ "</td><td>per minute</td></tr>");
                contenido+=("<tr><td style='text-align:right'>" + cutFromPoint(visitas_por_dia.toString(),2)+ "</td><td>per day(24h)</td></tr>");
                contenido+=("</tr></table></center>");

                div_estadisticas.innerHTML = contenido

            }

            //Return how many hours represents the time in msu
            function ms2Hours(ms)
            {
                return ms/(1000*60*60);
            }
            
            function ms2Minutes(ms)
            {
                return ms/(1000*60);
            }

            function ms2Days(ms)
            {
                return ms/(1000*60*60*24);
            }

            //Cuts a string from the "." character plus positions
            function cutFromPoint(str, positions)
            {
                if (str.indexOf(".")!=-1)
                {
                    return str.substr(0,str.indexOf(".")+positions+1); } 
                    else { return str; } 
                }

                function dateToString(adate)
                {
                return (adate.getHours());
            }


            function init()
            {
                pintaCuentayTiempo();
                pintaEstadisticas();

                var link = document.getElementById('resetButton');
                link.addEventListener('click', function() {
                    resetCounter();
                });

            }
            document.addEventListener('DOMContentLoaded', init);
    