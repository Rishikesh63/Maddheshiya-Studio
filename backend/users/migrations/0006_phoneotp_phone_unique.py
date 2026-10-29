from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_emailverificationotp'),
    ]

    operations = [
        # Step 1: Convert empty phone strings to NULL so unique constraint works
        migrations.RunSQL(
            sql="UPDATE users_customuser SET phone = NULL WHERE phone = '' OR phone IS NULL",
            reverse_sql=migrations.RunSQL.noop,
        ),
        # Step 2: Alter phone field to be unique + nullable
        migrations.AlterField(
            model_name='customuser',
            name='phone',
            field=models.CharField(blank=True, default=None, max_length=15, null=True, unique=True),
        ),
        # Step 3: Add PhoneOTP model
        migrations.CreateModel(
            name='PhoneOTP',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('otp', models.CharField(max_length=6)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_used', models.BooleanField(default=False)),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='phone_otps',
                    to='users.customuser',
                )),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
