#!/usr/bin/env bash
set -e

# Install dependencies
poetry lock --no-update
poetry install --no-dev

# Run database migrations
poetry run python manage.py migrate
