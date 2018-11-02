kyco Weather Feed
=================

A lightweight weather widget which hooks into [developer.yahoo.com/weather](https://developer.yahoo.com/weather/) and uses [WOEID](http://www.woeidlookup.com/).


How to install
--------------

    Download or clone the repo

You will primarily have to change the WOEID in the `core.js` file to the city/area you want the feed to pull weather for.

To find your city's WOEID use: http://woeid.rosselliot.co.nz/lookup/

Once you have the WOEID change the `location` variable in `core.js` to your city's WOEID.


Configuration
-------------

This weather feed was built with SASS and custom weather icons.
- If you wish to change the styling you will have to install ruby and SASS first.
- You can fully customise the weather icons, just replace the icons in the `images/weather_icons` directory with your own.


Support
-------

For bugs or improvements please use the [issues tab](https://github.com/kyco/kyco-weatherfeed/issues) or email [support@kyco.io](mailto:support@kyco.io).
