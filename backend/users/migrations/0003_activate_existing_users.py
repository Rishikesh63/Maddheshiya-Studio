from django.db import migrations


def activate_all_users(apps, schema_editor):
    """Activate all users that were created with is_active=False
    due to allauth mandatory email verification setting."""
    CustomUser = apps.get_model('users', 'CustomUser')
    updated = CustomUser.objects.filter(is_active=False).update(is_active=True)
    print(f"Activated {updated} user(s)")


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_customuser_profile_image'),
    ]

    operations = [
        migrations.RunPython(activate_all_users, migrations.RunPython.noop),
    ]
