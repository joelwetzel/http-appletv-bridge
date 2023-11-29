# http-appletv-bridge

### UNDER DEVELOPMENT: A bridge server that can run on a Raspberry Pi.  It will connect to your Apple TV, and expose its power state via a simple HTTP interface.

-----

### Prerequisites:
- NodeJS
- Python3
- Pip3

### Get Started:

1. >git clone https://github.com/joelwetzel/http-appletv-bridge.git
2. >cd http-appletv-bridge
3. >npm install
4. Edit the values in /src/config.env
5. >npm run build

-----

### Run from Command Line:

>npm run start

_____

### Install as a Service:

>sudo npm run install-service

It should now start automatically, but there are other commands too:

>sudo npm run start-service

>sudo npm run stop-service

>sudo npm run uninstall-service

After installing as a service, if you need to see the logs:

On MacOS: Look for httpappletvbridge in console.app

On Linux: journalctl -f -u httpappletvbridge

-----

### If you have trouble:

**Did pyatv install?**

>atvremote scan
>
>npm run check-pyatv

**Did pyatv install, but throws an error like: urllib3 v2.0 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with LibreSSL 2.8.3.**
>pip3 uninstall urllib3
>
>pip3 install 'urllib3<2.0'

For why, see: https://stackoverflow.com/questions/76187256/importerror-urllib3-v2-0-only-supports-openssl-1-1-1-currently-the-ssl-modu

**Does pyatv fail to install on Linux with an error like: fatal error: Python.h: No such file or directory**
>sudo apt-get install python-dev

or

>sudo apt-get install python3-dev

then

>pip3 install pyatv

**Did pyatv install, but atvremote isn't in PATH?**

>pip3 show pyatv
>
(copy the location)
>
>cd /etc
>
>sudo nano paths
>
(past the location in, and add /pyatv to the end of it)

**Having trouble running the service on Mac?**
- Check in /Library/LaunchDaemons for the plist file
- Check console.app for any logs being written
- Are the files cloned into somewhere accessible to the system at launch?  It probably can't access them in ~/Documents, for example.
