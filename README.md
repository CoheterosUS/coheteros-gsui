<p align="center">
  <img src="https://github.com/CoheterosUS/coheteros-gsui-continued/blob/main/public/images/logo.png" width="150" />
</p>

<h3 align="center">
  Coheteros US Ground Station
</h3>

<p align="center">
  <img src="https://github.com/CoheterosUS/coheteros-gsui-continued/blob/main/public/images/screenshot.png" />
</p>

#### EXPLANATION

This application has two modes of execution: testing mode (VITE_MODE=TEST) and production mode (VITE_MODE=PROD).
If testing mode is selected, follow the `Development` instructions below. This mode gives two options for representing data:

- Generating its own fake data.
- Receiving data via a COM port.

The data received via the COM port can be either from a real device or from a simulation program (like the one included) with a virtual COM pair (a separate program is needed to create the virtual COM pair).

If production mode is selected, follow the `Usage` instructions below. This mode gives one option for receiving data:

- Receiving data via a COM port.

The data received via the COM port can be either from a real device or from a simulation program (like the one included) with a virtual COM pair (a separate program is needed to create the virtual COM pair).

#### DOWNLOAD

Download the [latest release](https://github.com/CoheterosUS/coheteros-gsui/releases/latest) and extract the ZIP file. Modify the `.env` file as needed, then start the app:

```bash
cd backend
run.bat
```

#### INSTALLATION

Install npm packages:

```bash
npm install
```

Install Python packages:

```bash
cd backend
setup.bat
```

#### USAGE

Edit `.env` file to enable production mode:

```
VITE_MODE=PROD
```

Build frontend:

```bash
npm run build
```

Start app:

```bash
cd backend
run.bat
```

#### DEVELOPMENT

Edit `.env` file to enable testing mode:

```
VITE_MODE=TEST
```

Start backend:

```bash
cd backend
run.bat
```

Start frontend:

```bash
npm run dev
```

#### CONFIGURATION

Edit `.env` file to set the following variables:

- `VITE_MODE`: Set to `TEST` for testing mode or `PROD` for production mode.
- `VITE_BACKEND_PORT`: Set the port number for the backend server.
- `VITE_FRONTEND_PORT`: Set the port number for the frontend server (only used in testing mode).
- `VITE_WS_RECONNECT_INTERVAL`: Set the interval (in milliseconds) for websocket reconnection attempts. Reconnections can be forced manually.
- `VITE_DEFAULT_BAUDRATE`: Set the default baud rate that will be displayed in the dropdown for the UI. This option can also be used to add a custom baud rate that is not included in the default list.
- `VITE_MAX_DATA_POINTS`: Set the maximum number of data points to store for plotting/telemetry/logging.
- `VITE_PACKET_FREQUENCY`: Set the frequency (in Hz) of the fake telemetry packets generated during testing mode or during simulation with a virtual COM pair.
- `VITE_TESTING_COM_PAIR`: Set the other COM port of the virtual COM pair to be used during simulation. For example, if the GSUI is using `COM1`, set this variable to `COM2`. Fake packets will be sent through this COM port.
- `VITE_TESTING_COM_BAUDRATE`: Set the baud rate for the COM port used during simulation.

#### SIMULATION

- Generating its own fake data:

When simulating its own fake data, no additional steps are needed.

- Receiving data via a COM port:

When simulating data via a COM port, create a virtual COM pair using a separate program (e.g., VSPE), and run the simulation program included:

```bash
cd backend
simulate.bat
```

The simulation program will send fake telemetry packets through the COM port specified by `VITE_TESTING_COM_PAIR` in the virtual COM pair. The GSUI should be configured to use the other COM port in the pair.

#### SCRIPTS

- `setup.bat`: Creates a virtual environment and installs the required Python packages.
- `run.bat`: Activates the Python virtual environment and starts the backend server or the whole application, depending on the `VITE_MODE` environment variable.
- `simulate.bat`: Starts the simulation program that sends fake telemetry packets through a COM port.
- `activate.bat`: Activates the Python virtual environment.
- `deactivate.bat`: Deactivates the Python virtual environment.
