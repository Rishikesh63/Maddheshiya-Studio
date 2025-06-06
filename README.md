# 🎥 Maddheshiya Studio

**Maddheshiya Studio** is a full-stack web platform for managing and offering a wide range of photography, videography, and digital services. It is designed for studio owners and clients to interact via a modern interface with service browsing, media demos, pricing, and order processing.

---

## 🧾 Project Description

Maddheshiya Studio offers professional media services through an organized online portal. Service providers can upload image, video, and URL-based demos, while customers can explore, choose services, and interact via a clean frontend UI.

### 🎯 Key Features
- User registration with email verification (JWT + dj-rest-auth + allauth)
- Role-based system for service providers and clients
- Upload & preview of service media (images, videos, links)
- Service categorization (photography, videography, etc.)
- Dynamic pricing & inclusion breakdown
- Admin panel for management
- Full REST API with Django REST Framework
- Next.js/React frontend with responsive UI

---

## 🧩 Services Offered

| Category               | Description                        |
|------------------------|------------------------------------|
| Professional Photography | Wedding, Event, Product Shoots    |
| Videography            | Drone, Crane, Cinematic Shots      |
| AI-Powered Editing     | AI-driven enhancements             |
| Album Designing        | Custom digital and printed albums  |
| Drone Footage          | Aerial photography and videography |
| E-Commerce Photography | Product listings, white background |
| T-Shirt Printing       | Personalized apparel               |
| ID Card Making         | Smart and PVC card printing        |
| AI Assistant           | Custom AI assistants & automation  |
| Photo Framing          | Studio-quality print & frame       |

---
### Local Setup
```bash
git clone https://github.com/yourusername/maddheshiya-studio.git


### Backend Setup

cd backend
poetry install
poetry shelll
python manage.py makemigrations
python manage.py runserver


### Frontend Setup
cd frontend
npm install
npm run dev

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

