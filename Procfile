release: python manage.py migrate
web: daphne MajorProject.asgi:application --port $PORT --bind 0.0.0.0 -v2
celery: celery -A MajorProject.celery worker -l info
celerybeat: celery -A MajorProject beat -l INFO 
celeryworker2: celery -A MajorProject.celery worker & celery -A MajorProject beat -l INFO & wait -n