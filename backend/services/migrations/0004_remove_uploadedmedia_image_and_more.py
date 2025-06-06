# Generated by Django 5.2.1 on 2025-06-02 07:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0003_rename_title_service_name_remove_service_created_at_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='uploadedmedia',
            name='image',
        ),
        migrations.AddField(
            model_name='uploadedmedia',
            name='external_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='uploadedmedia',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to='service_uploads/'),
        ),
        migrations.AddField(
            model_name='uploadedmedia',
            name='media_type',
            field=models.CharField(choices=[('image', 'Image'), ('video', 'Video'), ('url', 'External URL')], default='image', max_length=10),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='service',
            name='category',
            field=models.CharField(choices=[('profesional_photography', 'Photography'), ('videography', 'Videography'), ('ai_powered_editing', 'AI Powered Editing'), ('custom_tshirt_printing', 'Custom T-Shirt Printing'), ('drone_footage', 'Drone Footage'), ('e_commerce_photography', 'E-Commerce Photography'), ('id_card_making', 'ID Card Making'), ('tshirt_printing', 'T-Shirt Printing'), ('albumb_designing', 'Album Designing'), ('photo_framing', 'Photo Framing'), ('ai_assistant', 'AI Assistant Development')], max_length=50),
        ),
    ]
