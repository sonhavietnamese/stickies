FROM python:3.12.4

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install -r /code/requirements.txt

COPY . /code

CMD ["sh", "-c", "export INNGEST_DEV=1 && uvicorn main:app --reload"]
