(function() {
	var API_WORLDTIME_KEY = "faf33e815c7bbad913db71d2b44a5";
	var API_WORLDTIME = "https://api.worldweatheronline.com/free/v2/weather.ashx?format=json&key=" + API_WORLDTIME_KEY + "&q=";
	
	var API_WEATHER_KEY = "07764994b5574b6a3c9c088c7b296272";
	var API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + API_WEATHER_KEY + "&";
	var IMG_WEATHER = "http://openweathermap.org/img/w/"
	
	var cityWeather = {};
	cityWeather.zone;
	cityWeather.icon;
	cityWeather.temp;
	cityWeather.temp_max;
	cityWeather.temp_min;
	cityWeather.main;

	var today = new Date();
	var timeNow = today.toLocaleTimeString();

	var $body = $("body");
	var $loader = $(".loader");
	var nombreNuevaCiudad = $("[data-input='cityAdd']");
	var buttonAdd = $("[data-button='add']");

	$ (buttonAdd).on("click", addNewCity);

	$( nombreNuevaCiudad ).on("keypress", function(event){
		if(event.which == 13){
			addNewCity();
		}
	});

	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(getCoords, errorFound);

	} else {
		alert("Por favor actualiza el navegador");
	}

	function errorFound(error) {
		alert("Un error ocurrió: " + error.code);
		//0: error desconocido
		//1: permiso denegado
		//2: Posición no está disponible
		//3: Timeout
	};

	function getCoords(position) {
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;

		console.log("Tu posición es: " + lat + "," + lon);

		$.getJSON(API_WEATHER_URL + "lat=" + lat + "&lon=" + lon, getCurrentWeather);

	};

	function getCurrentWeather(data) {
		console.log(data);
		cityWeather.zone = data.name;
		cityWeather.icon = IMG_WEATHER + data.weather[0].icon + ".png";
		cityWeather.temp = data.main.temp - 273.15;
		cityWeather.temp_max = data.main.temp_max - 273.15;
		cityWeather.temp_min = data.main.temp_min - 273.15;
		cityWeather.main = data.weather[0].main;



		//A partir de acá se renderiza el template
		renderTemplate(cityWeather);

	};

	function activateTemplate(id) { //con el id se hace reutilizable para poder hacer diferentes ciudades
		var t = document.querySelector(id);
		return document.importNode(t.content, true);
	};

	function renderTemplate(cityWeather) {
		var clone = activateTemplate("#template--city");
		//
		clone.querySelector("[data-time]").innerHTML =timeNow;
		clone.querySelector("[data-city]").innerHTML = cityWeather.zone;
		clone.querySelector("[data-icon]").src = cityWeather.icon;
		clone.querySelector("[data-temp='current']").innerHTML = cityWeather.temp.toFixed(1);
		clone.querySelector("[data-temp='max']").innerHTML = cityWeather.temp_max.toFixed(1);
		clone.querySelector("[data-temp='min']").innerHTML = cityWeather.temp_min.toFixed(1);

		$($loader).hide();
		$( $body ).append(clone);
	}

	function addNewCity(e) {
		event.preventDefault();
		$.getJSON(API_WEATHER_URL + "q=" + $(nombreNuevaCiudad).val(), getWeatherNewCity);
	}
	function getWeatherNewCity(data){

		$.getJSON(API_WORLDTIME + $(nombreNuevaCiudad).val(), function(response){

			cityWeather = {};
			cityWeather.zone = data.name;
			cityWeather.icon = IMG_WEATHER + data.weather[0].icon+".png";
			cityWeather.temp = data.main.temp - 273.15;
			cityWeather.temp_max = data.main.temp_max - 273.15;
			cityWeather.temp_min = data.main.temp_min - 273.15;

			console.log(response);
			console.log(response.data.current_condition[0].observation_time);

			//renderTemplate(cityWeather, response);
		} );

	}
})();
