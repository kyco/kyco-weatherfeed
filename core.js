/*
**
**  kyco-weatherfeed
**  ================
**
**  Version 1.0.0
**
**  Brought to you by
**  https://kyco.io
**
*/

loadWeatherFeed();

function loadWeatherFeed() {
	/*
	**	RSS Weather feed using http://developer.yahoo.com/weather/
	**	To find WOEID use http://woeid.rosselliot.co.nz/lookup/
	**	Weather feed url example: http://weather.yahooapis.com/forecastrss?w=1591691&u=c
	**	Params: w = WOEID & u = temp unit (f = farenheit or c = celsius)
	**	Below I have added a custom timestamp variable to the url so that on each function
	**	call we don't return cached results which could be very inaccurate.
	*/
	var location      = '1591691';
	var timestamp     = new Date().getTime(); // returns number of milliseconds since the epoch
	var weatehrApiUrl = 'http://weather.yahooapis.com/forecastrss?w=' + location + '&u=c&ts=' + timestamp;

	parseRSS(weatehrApiUrl, function(response) {
		// Create a weather object for easy referencing
		var weather = {
			feed : response,
			raw  : response.entries[0].content
		};

		// Get City/Town (area) and country
		var areaStr     = weather.feed.title.split('-').pop().split(',');
		weather.area    = $.trim(areaStr[0]);
		weather.country = countryCodes[$.trim(areaStr[1])];

		// Create a DOM element so we can scan feed raw
		// response and grab certain elements from it
		$('#kyco_weatherfeed').after('<div class="weather-api-response" style="display:none;">' + weather.raw + '</div>');

		// Get only text nodes and filter out whitespace elements so
		// we can get temp and current weather condition text
		var weatherStr = $('.weather-api-response').contents().filter(function() {
			if (this.nodeType == 3 && $.trim(this.data) != '') {
				return true;
			}
		});

		// Retrieve first text node
		weatherStr.get(0).textContent;

		// Retrieving the text pieces we need, weather description:
		weather.wd = $.trim(weatherStr.substr(0, weatherStr.indexOf(',')));

		// Weather temperature:
		weather.temp = $.trim(weatherStr.substr(weatherStr.indexOf(',') + 1, weatherStr.length));
		weather.temp = weather.temp.substr(0, weather.temp.indexOf(' C'));

		// Get weather condition code so we can show correct icon
		weather.wc = $('.weather-api-response').contents().filter('img').attr('src').split('/').pop().split('.')[0]; // weather description code (an interger between 0 - 47, or 3200 for N/A)

		// Check if weather code is valid and load correct icon if it is
		var testCode = parseInt(weather.wc);

		if ((testCode >= 0 && testCode <= 47) || testCode === 3200) {
			weather.icon = 'url(images/weather_icons/' + weather.wc + '.png) center top no-repeat';
		} else {
			// Load default weather not available icon (3200), see style.scss
			weather.wd = 'Not available';
		}

		// Update temperature in HTML
		$('#kyco_weatherfeed #kyco_loader').fadeOut(1250, function() {
			// Remove loader from DOM just becasue we can
			$(this).remove();

			$('#kyco_weather').animate({'right':'0'}, 350);
			$('#kyco_weather').html('<div class="country"><strong>' + weather.area + '</strong><br />' + weather.country + '</div><div class="weather"></div><div class="temp"><strong>' + weather.temp + '°C</strong></div>');
			$('#kyco_weather .weather').css({
				'background'      : weather.icon,
				'background-size' : 'cover'
			});
			$('#kyco_weather').attr('title', weather.area + ' ' + weather.temp + '°C, ' + weather.wd);
		});

		// Remove DOM element because it is of no more use to us
		$('.weather-api-response').remove();
	});

	// Function to retrieve RSS feed using a handy Google API
	function parseRSS(url, callback) {
		$.ajax({
			url      : 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url),
			dataType : 'json',
			success  : function(response) {
				callback(response.responseData.feed);
			}
		});
	}
}

/*
**	The yahoo response will give us the city name and a two-letter country code. Here we
**	create an array so we can easily replace the two-letter code with the country name.
**	I wasn't able to find a url from which I can just pull the country name so I have
**	a minified array here, which I got from: http://www.phpro.org/examples/Country-Array.html
*/
var countryCodes = {AF:"Afghanistan",AL:"Albania",DZ:"Algeria",AS:"American Samoa",AD:"Andorra",AO:"Angola",AI:"Anguilla",AQ:"Antarctica",AG:"Antigua And Barbuda",AR:"Argentina",AM:"Armenia",AW:"Aruba",AU:"Australia",AT:"Austria",AZ:"Azerbaijan",BS:"Bahamas",BH:"Bahrain",BD:"Bangladesh",BB:"Barbados",BY:"Belarus",BE:"Belgium",BZ:"Belize",BJ:"Benin",BM:"Bermuda",BT:"Bhutan",BO:"Bolivia",BA:"Bosnia And Herzegovina",BW:"Botswana",BV:"Bouvet Island",BR:"Brazil",IO:"British Indian Ocean Territory",BN:"Brunei", BG:"Bulgaria",BF:"Burkina Faso",BI:"Burundi",KH:"Cambodia",CM:"Cameroon",CA:"Canada",CV:"Cape Verde",KY:"Cayman Islands",CF:"Central African Republic",TD:"Chad",CL:"Chile",CN:"China",CX:"Christmas Island",CC:"Cocos (Keeling) Islands",CO:"Columbia",KM:"Comoros",CG:"Congo",CK:"Cook Islands",CR:"Costa Rica",CI:"Cote D'Ivorie (Ivory Coast)",HR:"Croatia (Hrvatska)",CU:"Cuba",CY:"Cyprus",CZ:"Czech Republic",CD:"Democratic Republic Of Congo (Zaire)",DK:"Denmark",DJ:"Djibouti",DM:"Dominica",DO:"Dominican Republic", TP:"East Timor",EC:"Ecuador",EG:"Egypt",SV:"El Salvador",GQ:"Equatorial Guinea",ER:"Eritrea",EE:"Estonia",ET:"Ethiopia",FK:"Falkland Islands (Malvinas)",FO:"Faroe Islands",FJ:"Fiji",FI:"Finland",FR:"France",FX:"France, Metropolitan",GF:"French Guinea",PF:"French Polynesia",TF:"French Southern Territories",GA:"Gabon",GM:"Gambia",GE:"Georgia",DE:"Germany",GH:"Ghana",GI:"Gibraltar",GR:"Greece",GL:"Greenland",GD:"Grenada",GP:"Guadeloupe",GU:"Guam",GT:"Guatemala",GN:"Guinea",GW:"Guinea-Bissau",GY:"Guyana", HT:"Haiti",HM:"Heard And McDonald Islands",HN:"Honduras",HK:"Hong Kong",HU:"Hungary",IS:"Iceland",IN:"India",ID:"Indonesia",IR:"Iran",IQ:"Iraq",IE:"Ireland",IL:"Israel",IT:"Italy",JM:"Jamaica",JP:"Japan",JO:"Jordan",KZ:"Kazakhstan",KE:"Kenya",KI:"Kiribati",KW:"Kuwait",KG:"Kyrgyzstan",LA:"Laos",LV:"Latvia",LB:"Lebanon",LS:"Lesotho",LR:"Liberia",LY:"Libya",LI:"Liechtenstein",LT:"Lithuania",LU:"Luxembourg",MO:"Macau",MK:"Macedonia",MG:"Madagascar",MW:"Malawi",MY:"Malaysia",MV:"Maldives",ML:"Mali",MT:"Malta", MH:"Marshall Islands",MQ:"Martinique",MR:"Mauritania",MU:"Mauritius",YT:"Mayotte",MX:"Mexico",FM:"Micronesia",MD:"Moldova",MC:"Monaco",MN:"Mongolia",MS:"Montserrat",MA:"Morocco",MZ:"Mozambique",MM:"Myanmar (Burma)",NA:"Namibia",NR:"Nauru",NP:"Nepal",NL:"Netherlands",AN:"Netherlands Antilles",NC:"New Caledonia",NZ:"New Zealand",NI:"Nicaragua",NE:"Niger",NG:"Nigeria",NU:"Niue",NF:"Norfolk Island",KP:"North Korea",MP:"Northern Mariana Islands",NO:"Norway",OM:"Oman",PK:"Pakistan",PW:"Palau",PA:"Panama", PG:"Papua New Guinea",PY:"Paraguay",PE:"Peru",PH:"Philippines",PN:"Pitcairn",PL:"Poland",PT:"Portugal",PR:"Puerto Rico",QA:"Qatar",RE:"Reunion",RO:"Romania",RU:"Russia",RW:"Rwanda",SH:"Saint Helena",KN:"Saint Kitts And Nevis",LC:"Saint Lucia",PM:"Saint Pierre And Miquelon",VC:"Saint Vincent And The Grenadines",SM:"San Marino",ST:"Sao Tome And Principe",SA:"Saudi Arabia",SN:"Senegal",SC:"Seychelles",SL:"Sierra Leone",SG:"Singapore",SK:"Slovak Republic",SI:"Slovenia",SB:"Solomon Islands",SO:"Somalia", ZA:"South Africa",GS:"South Georgia And South Sandwich Islands",KR:"South Korea",ES:"Spain",LK:"Sri Lanka",SD:"Sudan",SR:"Suriname",SJ:"Svalbard And Jan Mayen",SZ:"Swaziland",SE:"Sweden",CH:"Switzerland",SY:"Syria",TW:"Taiwan",TJ:"Tajikistan",TZ:"Tanzania",TH:"Thailand",TG:"Togo",TK:"Tokelau",TO:"Tonga",TT:"Trinidad And Tobago",TN:"Tunisia",TR:"Turkey",TM:"Turkmenistan",TC:"Turks And Caicos Islands",TV:"Tuvalu",UG:"Uganda",UA:"Ukraine",AE:"United Arab Emirates",UK:"United Kingdom",US:"United States", UM:"United States Minor Outlying Islands",UY:"Uruguay",UZ:"Uzbekistan",VU:"Vanuatu",VA:"Vatican City (Holy See)",VE:"Venezuela",VN:"Vietnam",VG:"Virgin Islands (British)",VI:"Virgin Islands (US)",WF:"Wallis And Futuna Islands",EH:"Western Sahara",WS:"Western Samoa",YE:"Yemen",YU:"Yugoslavia",ZM:"Zambia",ZW:"Zimbabwe"};
