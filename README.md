# shopTech - Backend

## Project Overview

The **shopTech** backend is built using Node.js and Express.js. It provides APIs for managing product data, including search, filter, sort, and pagination functionalities. The backend is connected to MongoDB for data storage and utilizes Firebase for authentication.

## Features

- **APIs**: Fetch and manage product data with endpoints for searching, filtering, and sorting.
- **Pagination**: Efficiently load products with pagination.
- **Authentication**: Google and Email/Password authentication via Firebase.
- **Data Management**: CRUD operations for product data.

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **Firebase Authentication**

### Setup

1.  Clone the repository:

    ```bash
    git clone <backend-repository-url>
    cd <backend-directory>
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file in the root directory and add the following environment variables with your mongodb name and password:

        ```env
        DB_NAME=
        DB_PASS=

    ```

    ```

4.  Start the server:

    ```bash
    npm start
    ```

## Deployment

- **Vercel**
- \*\*you can deploy it on your vercel also put the DB_NAME and DB_PASS environment variables there
