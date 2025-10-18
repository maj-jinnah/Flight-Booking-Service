# Flight Booking System — Microservice Architecture

The **Flight Booking System** is a backend application built with **Express.js**, **Sequelize ORM**, and **MySQL**, following a **microservice architecture**. It handles essential features such as flight management, bookings service, authentication, and notifications.

---

## Architecture Overview

This system is divided into multiple microservices that communicate through **REST APIs** and **RabbitMQ** message queues.
Each service is independently deployable and responsible for a specific domain of the application.

### System Components

| Service                          | Description                                                                                          | Repository                                                                               |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Auth & API Gateway**           | Handles authentication, authorization, and routes incoming requests to the appropriate microservice. | [Flight-Auth-API-Gateway](https://github.com/maj-jinnah/Flight-Auth-API-Gateway)         |
| **Flight Service**               | Manages flight data, including schedules, availability, and pricing.                                 | [Flight-Service](https://github.com/maj-jinnah/Flight-Service)                           |
| **Booking Service**              | Handles flight bookings, transactions, and communicates with the flight and notification services.   | [Flight-Booking-Service](https://github.com/maj-jinnah/Flight-Booking-Service)           |
| **Email & Notification Service** | Sends email notifications for booking confirmations and status updates.                              | [Flight-Notification-Service](https://github.com/maj-jinnah/Flight-Notification-Service) |

---

## High-Level Architecture Diagram

![Architecture Diagram](https://res.cloudinary.com/dkvt0cimw/image/upload/v1760751583/Blank_diagram_hnrtda.png)

---

## Getting Started

### Installation

1. Clone each service repository:

    ```
    git clone https://github.com/maj-jinnah/Flight-Auth-API-Gateway
    git clone https://github.com/maj-jinnah/Flight-Service
    git clone https://github.com/maj-jinnah/Flight-Booking-Service
    git clone https://github.com/maj-jinnah/Flight-Notification-Service
    ```

2. Install dependencies for each:

    ```
    cd <service-folder>
    npm install
    ```

3. Set up environment variables (`.env`) for each service:

    ```
    PORT=3000
    DB_USER=yourUserName
    DB_PASSWORD=yourPassword
    DB_NAME=dbName
    BASE_URL=yourProjectUrl

    <!-- Notification Service -->
    EMAIL_USER=<forNotificationServiceYourAppUserEmail>
    EMAIL_PASSWORD=<forNotificationServiceYourAppUserPassword>

    <!-- Auth & API Gateway service -->
    SALT_ROUNDS=<saltRound>
    JWT_SECRET=<yourJwtSecretKey>
    JWT_EXPIRY=<yourTime>
    ```

4. Go inside the `src` folder and execute the following command:
    ```
      npx sequelize init
    ```
5. And inside `src` to create Database and db migration execute those following command:

    ```
    npx sequelize db:create
    npx sequelize db:migrate
    ```

    - By executing the above command you will get migrations and seeders folder along with a config.json inside the config folder.
    - If you're setting up your development environment, then write the username of your db, password of your db.
    - If you're setting up test or prod environment, make sure you also replace the host with the hosted db url.

6. To run the server execute

```
npm run dev
```
