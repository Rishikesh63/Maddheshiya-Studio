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

users = CustomUser.objects.filter(email__iexact=email)

if users.exists():
    # Keep the first one, delete duplicates
    keep = users.first()
    duplicates = users.exclude(pk=keep.pk)
    count = duplicates.count()
    if count > 0:
        duplicates.delete()
        print(f"Deleted {count} duplicate account(s) for {email}")
    keep.is_staff = True
    keep.is_superuser = True
    keep.is_admin_user = True
    keep.set_password(password)
    keep.save()
    print(f"Promoted existing user to superuser: {email}")
else:
    base = email.split('@')[0]
    username = base
    counter = 1
    while CustomUser.objects.filter(username=username).exists():
        username = f"{base}{counter}"
        counter += 1
    user = CustomUser.objects.create_superuser(username=username, email=email, password=password)
    user.is_admin_user = True
    user.save()
    print(f"Created new superuser: {email}")
EOF
fi
