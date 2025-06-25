# HabitTracker
## Overview
**Habit Tracker** is a web application that helps users monitor and build positive daily habits. The app allows users to:
- Register and log in securely
- Add, edit, and delete habits
- Mark habits as completed each day
- View statistics including current and longest streaks
- Use the interface in both **light** and **dark mode**

The app follows a frontend-backend architecture:
- **Backend**: Python (Flask, SQLAlchemy)
- **Frontend**: React + TypeScript + Vite

### USDA FoodData Central integration
This project integrates with an external food database API (USDA FoodData Central) to allow users to search and retrieve nutritional information for various food items. This feature enhances the habit tracker with diet-awareness functionality allowing users to track their eating habits.
  
## How to run the project
### Requirements
- Python `>=3.10`
- Node.js `>=18`
- `pip` or `npm`

### Environment configuration
Before running the app, you need to configure environment variables.

### Backend (`back/.env`)

Create a `.env` file in the `back/` directory with the following content:

```env
DB_API_KEY=your_usda_api_key_here
SECRET_KEY=your_flask_secret_key
```

### Backend setup (Flask)
```bash
cd HabitTracker/back
python3 -m venv myenv
```
On MacOS: 
```bash
source myenv/bin/activate
```
On Windows: 
```bash
.\myenv\Scripts\activate
```
Going further:
```bash
pip install -r requirements.txt
export FLASK_APP=src/run.py
flask run
```

### Frontend setup (React)
```bash
cd HabitTracker/front/habit-tracker
npm install
npm run dev
```

### Availability
- Frontend is now available at http://localhost:3000
- Backend runs by default at: http://127.0.0.1:5000

## System requirements
- `blinker==1.9.0`
- `certifi==2025.4.26`
- `charset-normalizer==3.4.2`
- `click==8.2.1`
- `dnspython==2.7.0`
- `email_validator==2.2.0`
- `Flask==3.1.1`
- `flask-cors==6.0.0`
- `Flask-Login==0.6.3`
- `Flask-SQLAlchemy==3.1.1`
- `Flask-WTF==1.2.2`
- `idna==3.10`
- `itsdangerous==2.2.0`
- `Jinja2==3.1.6`
- `MarkupSafe==3.0.2`
- `requests==2.32.3`
- `SQLAlchemy==2.0.41`
- `typing_extensions==4.14.0`
- `urllib3==2.4.0`
- `Werkzeug==3.1.3`
- `dotenv==0.9.9`

## Project structure
```bash
HabitTracker/
├── .idea/                          # IDE configuration files (e.g. for PyCharm)
├── back/                           # Backend application (Python + Flask)
│   ├── src/
│   │   ├── app/                    # Main Flask app logic (models, views, authentication, etc.)
│   │   ├── instance/               # Flask instance-specific config (e.g., SQLiteDB)
│   │   ├── run.py                  # Entry point to run the Flask app
│   │   └── .gitignore              # Ignore unnecessary files in backend source
│   └── .gitignore                  # Backend-level ignored files
├── front/
│   └── habit-tracker/             # Frontend application (React + TypeScript + Vite)
│       ├── .vscode/               # Optional VSCode settings
│       ├── public/                # Static files (favicon, base HTML, etc.)
│       ├── src/                   # Frontend source code (components, hooks, styles)
│       ├── .cta.json              # Custom configuration (project-specific)
│       ├── .cursorrules           # Optional plugin or editor rule definitions
│       ├── .env                   # Environment variables for frontend (e.g., VITE_API_URL)
│       ├── .gitignore             # Ignore node_modules, build files, env vars, etc.
│       ├── components.json        # Component registry (used by some tools/editors)
│       ├── index.html             # Main HTML template loaded by Vite/React
│       ├── package-lock.json      # Dependency lockfile for NPM
│       ├── package.json           # NPM dependencies and frontend scripts
│       ├── README.md              # (Optional) frontend-specific documentation
│       ├── tsconfig.json          # TypeScript configuration
│       └── vite.config.js         # Vite build/server configuration
├── myenv/                         # Python virtual environment (should be in .gitignore)
├── .gitignore                     # Global gitignore (venv, IDE files, etc.)
├── README.md                      # Main project documentation
└── requirements.txt               # Python dependencies for backend (install with pip)
```

## Screenshots
- Dashboard
  ![Dashboard]()
### Habit completion examples
- Yes/no habit:
  ![Yes/no habit](https://github.com/HavilMal/HabitTracker/blob/featute/readme/screenshots/Zrzut_ekranu_2025-06-25_150510.png)
- Measurement habit:
  ![Measurement habit](https://github.com/HavilMal/HabitTracker/blob/featute/readme/screenshots/Zrzut_ekranu_2025-06-25_150522.png)
- Activity habit:
  ![Activity habit](https://github.com/HavilMal/HabitTracker/blob/featute/readme/screenshots/Zrzut_ekranu_2025-06-25_150537.png)
- Drinking water habit:
  ![Drinking water habit](https://github.com/HavilMal/HabitTracker/blob/featute/readme/screenshots/Zrzut_ekranu_2025-06-25_150549.png)
- Eating habit:
  ![Eating habit](https://github.com/HavilMal/HabitTracker/blob/featute/readme/screenshots/Zrzut_ekranu_2025-06-25_150605.png)

## Notes
This project was developed as a part of the “Języki Skryptowe” (Scripting Languages) course at Wrocław University of Science and Technology (Politechnika Wrocławska).