kyco-weatherfeed
================

A lightweight weather widget which hooks into developer.yahoo.com/weather and uses WOEID.


How to install
--------------

Download the zip or clone the repo. You will primarily have to change the WOEID in the *core.js* file
to the city/area you want the feed to pull weather for.

To find your city's WOEID use this url:
	http://woeid.rosselliot.co.nz/lookup/

Once you have the WOEID change the *location* variable in *core.js* to your city's WOEID.


Configuration
-------------

This weather feed was built with SASS and custom weather icons.
- If you wish to change the styling you will have to install ruby and SASS first.
- You can fully customise the weather icons, just replace the icons in the *weather_icons*
directory with your own.
- The loader is purely CSS and currently only works in Firefox.


What's to come
--------------

Demo page. Improved installation and setup for easy use.


Support
-------

For bugs or improvements please use the [issues tab](https://github.com/kyco/kyco-weatherfeed/issues)
or email [support@kycosoftware.com](mailto:support@kycosoftware.com).
