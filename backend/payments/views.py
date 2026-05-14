import boto3
import razorpay
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Payment

razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)


@api_view(['POST'])
def create_order(request):
    """Create a Razorpay order and store a pending payment record."""
    name = request.data.get('name', '').strip()
    email = request.data.get('email', '').strip()
    phone = request.data.get('phone', '').strip()
    items = request.data.get('items', [])   # [{id, title, price, downloadPath}]
    amount = request.data.get('amount', 0)  # total in ₹ (rupees)

    if not all([name, email, phone, items, amount]):
        return Response({'error': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)

    amount_paise = int(float(amount) * 100)

    order = razorpay_client.order.create({
        'amount': amount_paise,
        'currency': 'INR',
        'payment_capture': 1,
    })

    Payment.objects.create(
        razorpay_order_id=order['id'],
        customer_name=name,
        customer_email=email,
        customer_phone=phone,
        amount=amount_paise,
        items=items,
    )

    return Response({
        'order_id': order['id'],
        'key_id': settings.RAZORPAY_KEY_ID,
        'amount': amount_paise,
    })


@api_view(['POST'])
def verify_payment(request):
    """Verify Razorpay signature and return pre-signed S3 download URLs."""
    payment_id = request.data.get('razorpay_payment_id', '')
    order_id = request.data.get('razorpay_order_id', '')
    signature = request.data.get('razorpay_signature', '')

    # Verify signature using Razorpay SDK
    try:
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature,
        })
    except razorpay.errors.SignatureVerificationError:
        return Response({'error': 'Payment verification failed.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        payment = Payment.objects.get(razorpay_order_id=order_id)
    except Payment.DoesNotExist:
        return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

    payment.razorpay_payment_id = payment_id
    payment.razorpay_signature = signature
    payment.status = 'paid'
    payment.save()

    # Generate pre-signed S3 download URLs (24-hour expiry) for digital items
    downloads = []
    if settings.AWS_STORAGE_BUCKET_NAME:
        s3 = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )
        for item in payment.items:
            if item.get('downloadPath'):
                try:
                    url = s3.generate_presigned_url(
                        'get_object',
                        Params={
                            'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                            'Key': item['downloadPath'],
                            'ResponseContentDisposition': (
                                f'attachment; filename="{item["title"]}.zip"'
                            ),
                        },
                        ExpiresIn=86400,  # 24 hours
                    )
                    downloads.append({
                        'id': item['id'],
                        'title': item['title'],
                        'url': url,
                    })
                except Exception:
                    pass

    return Response({
        'status': 'paid',
        'payment_id': payment_id,
        'customer_name': payment.customer_name,
        'items': payment.items,
        'downloads': downloads,
    })
