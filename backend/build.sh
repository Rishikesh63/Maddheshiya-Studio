#!/usr/bin/env bash
set -e

# Regenerate lock file to pick up any new dependencies, then install
poetry lock --no-update
poetry install --no-dev
