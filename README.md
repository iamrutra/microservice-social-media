# I DIDN'T HAVE TIME TO FINALIZE THE FUNCTIONALITY OF SENDING PHOTOS TO POSTS, TO ADD UNITTESTS, CATCH OWN EXCEPTIONS AND THE PROJECT WOULD HAVE BEEN DONE, so
## ATTENTION!!! THE PROJECT IS NOT FINISHED TO THE END, BECAUSE I (THE ONLY DEVELOPER^^) HAD TECHNICAL PROBLEMS DURING THE DEVELOPMENT, AND I COULD NOT FINISH THE PROJECT

# Microservice Social Media

This project is a social media platform built using a microservice architecture. Each component of the system is implemented as a separate microservice, making the application scalable, modular, and easy to maintain. It supports user authentication, content management, likes, comments, and more.

# Microservice Social Media

This project is a social media platform built using a microservice architecture. Each service is responsible for a specific functionality, such as user management, post creation, comments, likes, recommendations, and real-time messaging through WebSockets. The system also leverages caching, event-driven communication, and robust API documentation.

## Features

- **Microservice Architecture**: Scalable and modular design, where each service is responsible for a specific domain.
- **User Management**: Users can register, log in, and manage their profiles.
- **Post Creation & Management**: Users can create, update, and delete posts.
- **Comments & Likes**: Users can comment on posts and like them.
- **Recommendations**: Personalized recommendations for users based on their activity and preferences.
- **Caching**: Redis caching to speed up frequently accessed data.
- **WebSockets**: Real-time communication between users via WebSockets (e.g., messaging).
- **API Documentation**: Swagger/OpenAPI for API exploration and testing.

## Technologies Used

This project uses the following technologies:

- **Java** (Spring Boot) — Backend framework for building microservices.
- **React** — Frontend library for building user interfaces.
- **Keycloak** — Identity and access management for user authentication and authorization.
- **JWT (JSON Web Tokens)** — Token-based authentication for securing API endpoints.
- **MySQL** — Relational database for storing user data, posts, comments, likes, and recommendations.
- **Redis** — In-memory data structure store for caching frequently accessed data.
- **Kafka** — Event streaming platform for handling asynchronous communication between services.
- **WebSockets** — Real-time communication between users.
- **Swagger (OpenAPI)** — API documentation for easy exploration of the services.


