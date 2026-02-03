<p align="center">
  <img src="https://github.com/CoheterosUS/coheteros-gsui-continued/blob/main/public/logo.png" width="150" />
</p>

<h3 align="center">
  Coheteros US Ground Station
</h3>

<p align="center">
  <img src="https://github.com/CoheterosUS/coheteros-gsui-continued/blob/main/public/screenshot.png" />
</p>

#### Installation

Install npm packages:

```bash
npm install
```

Install Python packages:

```bash
cd backend
setup.bat
```

#### Usage

Start backend:

```bash
cd backend
run.bat
```

Start frontend:

```bash
npm run build
npm run preview
```

#### Development

Edit `.env` file to enable testing mode if needed:

```
VITE_TESTING_MODE=TRUE
```

If not enabled, create a virtual COM pair, and run the simulation:

```bash
cd backend
simulate.bat
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
