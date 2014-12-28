//Developed by alberto.moratilla@gmail.com on January 2011 and revised on December 2014
//http://about.me/alberto.moratilla
//A Chrome's basic extension example
//Icon taken from: http://www.famfamfam.com/lab/icons/silk/

        var contador_visitas=0;
        
        var tiempo_inicio = new Date();	    //Check the time when chrome loads
        var start_timer = new Date();	    //To save the amount of time browsing this session
        var tiempo_acumulado = 0
        
        
        chrome.browserAction.setTitle({title:"Check usage stats"});
        

        //Initializes statistics
        if (!localStorage.PC_uses)
            localStorage.PC_uses = 1;
        else
            localStorage.PC_uses = (parseInt(localStorage.PC_uses))+1;



        //Recibe el request del content script cuando se carga la página.
        chrome.extension.onRequest.addListener(function(feeds,sender,sendResponse)
        {
            aumenta_contador_visitas();
            //sendResponse({});
        });
		

        //increases the counter and calls badge's refresh function
        function aumenta_contador_visitas(){
            contador_visitas++;
            badge();
            guardaEstadisticas();
        }
		
		

        function badge() {
            var texto = String(contador_visitas);
            if(contador_visitas>1000)
            {
                texto = String(Math.floor(contador_visitas/1000) + "K")
            }
	
            chrome.browserAction.setBadgeText({text:texto});
            chrome.browserAction.setBadgeBackgroundColor({color:[0,0,255,255]});
        }


        //Event when de extension is loaded: whether it is chrome who start or the user who enables the extension
        window.onload = function() {
            cargaEstadisticas();
            badge();
        };



        //Load the number of pages visited from the last time
        function cargaEstadisticas()
        {
            
            if (!localStorage.PC_visitas)   //Si no hay nada
            {
                contador_visitas = 0;
                tiempo_inicio = new Date();
                tiempo_acumulado = 0
            }
            else  //There are data in localstorage
            {
                contador_visitas = JSON.parse(localStorage.PC_visitas);
                tiempo_inicio = new Date((Number(JSON.parse(localStorage.PC_tiempo))));
                tiempo_acumulado = (Number(JSON.parse(localStorage.PC_tiempo_acumulado)));
            }
        }
		

        function guardaEstadisticas()
        {
            //When extension ends, saves the counter and the time.
      
            localStorage.PC_visitas =  JSON.stringify( contador_visitas ) ;
            localStorage.PC_tiempo =  JSON.stringify( tiempo_inicio.getTime()) ;
            
            if (!localStorage.PC_tiempo_acumulado)
            {
                localStorage.PC_tiempo_acumulado = 0;
            }
            
            var ahora = new Date();	//current time 
            
            
            localStorage.PC_tiempo_acumulado = JSON.stringify(tiempo_acumulado+(ahora.getTime()-start_timer.getTime()));
        }



        //Event when extension closes.
        window.onunload =
            function () {
            guardaEstadisticas();

        };




        //Time object
        function tiempo (inicio, fin)
        {
            this.inicio = inicio;
            this.fin = fin;
        }
    
        //Returns the time has been accumulated since the start of the program
        function getAcumulado()
        {
            var ahora = new Date();
            return (ahora.getTime() - start_timer.getTime()) + tiempo_acumulado;
      
        }
    

        //Transforms from ms to d:hh:mm:ss format
        function formatTime(ms)
        {
            var dias = Math.floor(ms / (1000*60*60*24));
            ms = ms - dias*(1000*60*60*24);

            var horas = Math.floor(ms / (1000*60*60));
            ms = ms - horas*(1000*60*60);

            var minutos = Math.floor(ms / (1000*60));
            minutos=(minutos <=9)?"0"+minutos:minutos;
            ms = ms - minutos*(1000*60);


            var segundos = Math.floor(ms / (1000));
            segundos=(segundos <=9)?"0"+segundos:segundos;
            ms = ms%(1000);

            return (dias +"d " + horas + ":" + minutos + ":" + segundos);
        }
