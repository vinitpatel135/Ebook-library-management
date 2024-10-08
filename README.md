# Ebook-library-management

This project is an Ebook Management System built using Node.js, Express.js, MongoDB, and Multer for file uploads. The system allows users to upload ebooks, view a list of ebooks, and manage ebooks by performing CRUD operations (Create, Read, Update, Delete).


## Live Demo Link
- Frontend - https://ebook-library-management-vinit-patels-projects.vercel.app/
- backend - https://ebook-library-management.onrender.com

# Features
 - **User Authentication**: Secure login and access control for users (handled in UserController).
 - **Ebook Management**: Users can:
     - Upload ebooks with title, description, publish date, author, and language.
     - View a list of ebooks.
     - Edit existing ebooks.
     - Delete ebooks.
 - **Responsive UI**: Built with Bootstrap 5 and Material UI to ensure mobile and desktop compatibility.
 - **Notifications**: Display notifications using **React Toastify**.
 - **Email service**: Confirms a user's e-book borrowing using **Nodemailer**.
 - **File Uploads**: Ebooks images or files are uploaded and stored using Multer.
 - **Static File Serving**: Uploaded files are served statically from the /public directory.

# Installation
  1. Install dependencies :-
     - Frontend:
         cd frontend
         npm install
     - Backend:
         cd backend
         npm install
  2. Create a .env file in the backend directory with the following environment variables :-
      - MONGODB_URI=<Your MongoDB Connection String>
      - JWT_SECRET=<Your JWT Secret Key>
      - PORT=<Your PORT>
  3. Run the backend :-
      - cd backend
      - npm run dev
  4. Run the frontend:
      - cd frontend
      - npm start
