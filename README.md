# AI_CAREER_ASSISTANT

A full-stack chatbot application built using the MERN stack (MongoDB, Express, React, Node.js) that integrates with the OpenAI API for chat completion. This project features user authentication, a dynamic chat interface, and state management via the Context API.

## Features -
* Chatbot: Integrates OpenAI's GPT models to generate responses based on user input.
* Authentication: Secure user login and registration using JWT and bcrypt.
* State Management: Global state handling using React's Context API for efficient data flow and user session management.
* Responsive UI: Built with React for a seamless user experience across devices.
* Backend API: Node.js and Express handle server-side logic and interact with MongoDB to manage user sessions and queries.

## Technologies Used-

### Frontend:
* React: For building the user interface.
* React Router DOM: For handling navigation between routes.
* Context API: For managing global application state (authentication and chat state).
* Tailwind CSS: For styling and responsive design.
* TypeScript: For static typing, helping catch errors early and improve code quality.

### Backend:
* Node.js & Express: For creating the backend API and handling requests.
* MongoDB & Mongoose: For storing user data and managing queries.
* JWT (JsonWebToken): For secure authentication and session management.
* bcrypt: For hashing user passwords.
* OpenAI API: To integrate the chatbot's natural language processing.

### Additional Libraries:
* dotenv: For environment variable management.
* Morgan: For logging HTTP requests.
* Concurrently: For running the frontend and backend servers simultaneously during development.
