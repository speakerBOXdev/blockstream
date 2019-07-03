FROM python:3

WORKDIR /usr/src/app

COPY ./_app/ /
RUN pip install -e .

ENV FLASK_APP=blockstream
ENV FLASK_ENV=development
RUN flask init-db

CMD [ "flask", "run", "--host=0.0.0.0" ]