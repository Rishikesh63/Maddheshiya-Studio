from django.db import migrations, models
import django.core.validators
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0002_add_label_to_product_sample'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductDimension',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('size_id', models.CharField(
                    max_length=20,
                    choices=[
                        ('6x8',   '6×8'),
                        ('8x10',  '8×10'),
                        ('8x12',  '8×12'),
                        ('10x12', '10×12'),
                        ('10x15', '10×15'),
                        ('12x15', '12×15'),
                        ('12x18', '12×18'),
                        ('16x20', '16×20'),
                        ('16x24', '16×24'),
                        ('18x24', '18×24'),
                        ('20x24', '20×24'),
                        ('20x30', '20×30'),
                        ('24x36', '24×36'),
                    ],
                )),
                ('price', models.DecimalField(
                    decimal_places=2,
                    max_digits=10,
                    validators=[django.core.validators.MinValueValidator(0)],
                )),
                ('is_active', models.BooleanField(default=True)),
                ('order', models.PositiveIntegerField(default=0)),
                ('product', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='dimensions',
                    to='products.product',
                )),
            ],
            options={
                'ordering': ['order', 'size_id'],
                'unique_together': {('product', 'size_id')},
            },
        ),
    ]
