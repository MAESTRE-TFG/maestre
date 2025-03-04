if [[ "$OSTYPE" == "darwin"* ]]; then
    source venv/bin/activate
else
    # For Windows, we need to use the full path to python in the virtual environment
    VENV_PYTHON="$(pwd)/venv/Scripts/python.exe"
fi

cd backend
if [[ "$OSTYPE" == "darwin"* ]]; then
    python3 manage.py migrate
    python3 manage.py runserver
else
    "$VENV_PYTHON" manage.py migrate
    "$VENV_PYTHON" manage.py runserver
fi
