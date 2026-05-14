from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['razorpay_order_id', 'customer_name', 'customer_email', 'amount_display', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['customer_name', 'customer_email', 'razorpay_order_id', 'razorpay_payment_id']
    readonly_fields = ['razorpay_order_id', 'razorpay_payment_id', 'download_token', 'created_at', 'updated_at']

    def amount_display(self, obj):
        return f'₹{obj.amount // 100}'
    amount_display.short_description = 'Amount'
