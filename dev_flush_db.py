import os

try:
    os.rmdir('./backend/app/__pycache__')
except:
    print('Remove pycache failed')

try:
    os.remove('./backend/db.sqlite3')
except:
    print('Remove db file failed')

os.system('cd backend && python manage.py migrate --run-syncdb')
