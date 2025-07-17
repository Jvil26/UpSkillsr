# Use official Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Accept build-time environment (default to prod)
ARG ENV=development
ENV ENV=$ENV

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project files
COPY . .

# For production: collect static files and remove dev-only files
RUN if [ "$ENV" = "production" ]; then \
      python manage.py collectstatic --noinput ; \
    fi

# Expose the port
EXPOSE 8000

# Start Django differently depending on the environment
CMD if [ "$ENV" = "development" ]; then \
      echo "Running in development mode" && \
      python manage.py runserver 0.0.0.0:8000 ; \
    elif [ "$ENV" = "production" ]; then \
      echo "Running in production mode" && \
      gunicorn skillsswap.wsgi:application --bind 0.0.0.0:8000 ; \
    else \
      echo "Invalid ENV value: '$ENV'. Must be 'development' or 'production'." && exit 1 ; \
    fi
