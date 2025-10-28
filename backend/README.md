# Favorite Movies & TV Shows Backend

This is the backend service for the **Favorite Movies & TV Shows Web Application**

It provides RESTful APIs to manage a list of favorite movies and TV shows with features like add, edit, delete, and infinite-scroll pagination.


## Tech Stack

- **Backend Framework:** Node.js + Express  
- **Database:** MySQL  
- **ORM:** Prisma  
- **Validation:** Zod  
- **Language:** TypeScript  


## Project Setup Guide

Follow these steps to set up and run the project locally.

### Clone the Repository
    git clone https://github.com/your-username/favorite-movies-backend.git
    cd favorite-movies-backend

### Install Dependencies
    npm install

### Configure Environment Variables
    # MySQL Database connection string
    DATABASE_URL="mysql://username:password@localhost:3306/movies_db"

### Initialize Prisma and Database

    npx prisma init - #Initialize Prisma

    npx prisma generate - #Generate Prisma client

    npx prisma migrate dev --name init - #Apply database migrations

### Start the Server
    npm run dev
