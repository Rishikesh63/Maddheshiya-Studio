#!/usr/bin/env bash
set -e

# Install dependencies
poetry lock --no-update
poetry install --no-dev

# Run database migrations
poetry run python manage.py migrate

# Create/promote superuser from environment variables (safe to run every deploy)
if [ -n "$SUPERUSER_EMAIL" ] && [ -n "$SUPERUSER_PASSWORD" ]; then
    poetry run python manage.py shell << 'EOF'
import os
from users.models import CustomUser

email = os.environ.get('SUPERUSER_EMAIL')
password = os.environ.get('SUPERUSER_PASSWORD')

user, created = CustomUser.objects.get_or_create(
    email=email,
    defaults={'username': email.split('@')[0], 'is_staff': True, 'is_superuser': True, 'is_admin_user': True}
)
if created:
    user.set_password(password)
    print(f"Superuser created: {email}")
else:
    user.is_staff = True
    user.is_superuser = True
    user.is_admin_user = True
    print(f"Existing user promoted to superuser: {email}")

user.save()
EOF
fi
