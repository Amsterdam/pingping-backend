FROM python:3.7.4-slim-stretch


WORKDIR /app
COPY requirements.txt /app/

# OS Packages installed becase of:
## https://pypi.org/project/mysqlclient/

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends \
        default-libmysqlclient-dev \
        python3-dev \
        gcc \
    && pip install --no-cache-dir -r requirements.txt \
    && apt-get purge -y \
        python3-dev \
        gcc \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

COPY . /app/

ENV DEBUG=False

EXPOSE 8000
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.1/wait /app/wait
RUN chmod +x docker-entrypoint.sh wait
ENTRYPOINT [ "/app/docker-entrypoint.sh" ]
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]