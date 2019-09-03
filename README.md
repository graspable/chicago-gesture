# Chicago Gesture Experiment

Requires NodeJS, NPM, git.

**Installation:**

1. Clone this repository.
2. Install dependencies by running `npm i`.
3. Open `experiment.html` in your browser.

To run this experiment on an iPad, copy all files to a webserver.

### Serving the page from your local computer

You can serve the page from your local computer by following these steps.

1. Open the package.json file in an editor and find line 14, which defines a script named start. Replace the host string found at the end of this command with your own. You can find your IP, on windows for example, by opening a powershell and running `ipconfig`. You will most likely need the IPv4 Address under Wireless LAN adapter Wi-Fi.
2. Run `npm start`. Get your iPad, and open a browser like Safari. Then in your browser, enter into the address bar "(your-ip):5000/experiment.html." Make sure you are connected to the same Wi-Fi network as the computer running the process.
3. To view the demo without using an iPad or other touch device (as the interaction requires two fingers), you can run `npm run start:local` instead.
