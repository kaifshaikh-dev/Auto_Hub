# Auto_Hub
Auto_Hub is a full-stack, mobile-responsive MERN web application designed for car and bike dealerships. It provides a complete dealer inventory management system alongside a customer-facing portal to browse vehicles, filter inventories, and contact dealers directly. 

## 🚀 Project Overview
Auto_Hub aims to streamline the process of managing a vehicle dealership's inventory while offering a premium browsing experience for potential buyers. Dealers can add, edit, and delete vehicles, manage high-quality media (images and videos), and specify details like location, make, brand, and pricing. Customers can easily find their desired vehicles and reach out via direct contact methods like WhatsApp.

The application is built with a **mobile-first design philosophy**, guaranteeing an optimal user experience across all devices.

## ✨ Key Features
- **Dealer Dashboard:** Secure, authenticated area for dealers to control their inventory.
- **Vehicle Inventory Management:**
  - Add, edit, or remove vehicles (Cars/Bikes) with flexible make/brand entry.
  - Supports large bulk deletes for inventory management.
  - Tracks specific vehicle locations, allowing precise inventory location data.
- **Advanced Media Uploads:**
  - Integrated Cloudinary support for uploading up to 10 images per vehicle.
  - Generous 100MB upload limit for vehicle showcase videos.
- **Secure Authentication:**
  - Standard JWT-based email/password authentication.
  - Seamless **Google OAuth Login** integration for quick access.
  - Complete password recovery flow (Forgot/Reset password) with email delivery via Nodemailer.
- **Customer Portal:**
  - Browse available vehicles with a clean, responsive UI.
  - Direct integration for initiating contact via WhatsApp or phone.

## 🛠️ Technologies Used

### Frontend (Client)
- **React.js (Vite):** Fast, modern UI development.
- **Tailwind CSS:** Utility-first framework for responsive, custom mobile-first designs.
- **React Router Dom:** Handling application routing.
- **Axios:** Streamlined API requests to the backend.
- **Google OAuth (`@react-oauth/google`):** Handling secure social login.
- **Lucide React:** Beautiful, consistent iconography.
- **React Helmet Async:** For managing document head tags and SEO.

### Backend (Server)
- **Node.js & Express.js:** Robust and scalable server infrastructure.
- **MongoDB & Mongoose:** NoSQL database for flexible data modeling and inventory storage.
- **Authentication & Security:**
  - `bcryptjs` for password hashing.
  - `jsonwebtoken` for secure session management.
  - `helmet` and `cors` for API security.
- **Media Support:**
  - `multer` & `streamifier` for handling multipart/form-data.
  - `cloudinary` for scalable, cloud-based image and video storage.
- **Email Delivery:**
  - `nodemailer` & `mailgen` for sending transactional emails (like password resets).

## ⚙️ How the Project Works (System Architecture)
1. **Client-Side:** The React frontend displays the UI. When a user or dealer interacts with the app (e.g., logging in or uploading a vehicle), Axios sends HTTP requests to the Express server.
2. **Authentication Flow:** Users authenticate locally or via Google. The backend creates a JWT, which is returned and stored securely on the client to authenticate subsequent requests to protected routes.
3. **Media Handling:** When a dealer uploads vehicle images/videos, `multer` processes the files in memory on the server. `streamifier` then pipes these files directly to Cloudinary, ensuring the server's disk space is unaffected. Cloudinary returns secure URLs, which are saved to the vehicle's MongoDB record.
4. **Data Persistence:** The Express server interacts with MongoDB using Mongoose schemas. Vehicle details, locations, pricing, and media URLs are stored and easily queried for the frontend catalog.


