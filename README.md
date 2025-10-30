# Kumalo Quality Yoghurt
# Yoghurt Project

This repository contains the source code for the Yoghurt system.

## Files Overview
- **app.py** — main application file
- **config.json** — stores configuration values
- **static/** — holds CSS and JavaScript files
- **templates/** — HTML layout files

Website Features:

Frontend Pages:

Beautiful homepage with hero section, featured products, customer testimonials, and call-to-action
Products catalog with filtering by flavor and stock status
Order page with shopping cart functionality and checkout form
Contact page for inquiries and special requests
Admin dashboard with authentication
Admin Dashboard:

Secure login/signup system using Bolt Database authentication
Manage orders with status updates (pending, confirmed, preparing, delivered, cancelled)
View and respond to contact submissions
Monitor product inventory and update stock status
Delete orders and messages as needed
Database (Bolt Database SQL):

Products table with 6 sample yoghurt flavors pre-loaded
Orders table for customer purchases
Contact submissions table for inquiries
Proper Row Level Security policies
Public can view products and place orders
Only authenticated admins can manage data
Design Features:

Yoghurt-inspired colors: strawberry pink, chocolate brown, vanilla cream, blueberry blue
Smooth animations and hover effects throughout
Fully responsive design for mobile and desktop
Professional typography with Playfair Display and Inter fonts
Elegant shadows and transitions
Stock photos from Pexels for product images