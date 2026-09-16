# Imagen de ejecución para Django GIS con GDAL.
FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    GDAL_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/libgdal.so

WORKDIR /aplicacion

RUN apt-get update \
    && apt-get install --no-install-recommends -y libgdal32 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . ./

RUN useradd --create-home --shell /usr/sbin/nologin sivad \
    && chown -R sivad:sivad /aplicacion
USER sivad

EXPOSE 8000
ENTRYPOINT ["sh", "/aplicacion/entrada.sh"]
CMD ["gunicorn", "configuracion.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--access-logfile", "-"]
