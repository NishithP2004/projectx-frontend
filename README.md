# Project X

[![Watch the video](http://i3.ytimg.com/vi/zqVGD1JXp5A/hqdefault.jpg)](https://youtu.be/zqVGD1JXp5A)

> _The power of knowledge in the palm of your hands..._

## Execution Steps

1. **Clone Frontend Repository:** 
   - Clone the frontend repository from GitHub using the following command:
     ```bash
     git clone https://github.com/NishithP2004/projectx-frontend
     ```

2. **Clone Backend Repository:** 
   - Similarly, clone the backend repository from GitHub:
     ```bash
     git clone https://github.com/NishithP2004/projectx-backend
     ```

3. **Navigate to Frontend Directory:** 
   - Move into the `projectx-frontend` directory:
     ```bash
     cd projectx-frontend
     ```

4. **Create Environment Variables File:** 
   - Create a `.env` file in the root of the `projectx-frontend` directory.
   - Copy the contents of the `.env.example` file provided below and paste it into the `.env` file.
   - Fill in the required values for your environment variables.

5. **Start Frontend Service:** 
   - Run Docker Compose to start the frontend service:
     ```bash
     docker-compose up
     ```

6. **Navigate to Backend Directory:** 
   - Switch to the `projectx-backend` directory:
     ```bash
     cd ../projectx-backend
     ```

7. **Start Backend Service:** 
   - Ensure you have Microsoft Azure CLI tools installed.
   - Start the backend service using the Azure Functions Core Tools:
     ```bash
     func start
     ```

---

## .env.example (Common to both frontend & backend)

```
G_SEARCH_KEY=
G_CX=
BING_CONFIG_ID=
BING_API_KEY=
GOOGLE_PALM_API_KEY=
GOOGLE_VERTEX_AI_TOKEN=
GOOGLE_VERTEX_AI_PROJECT_ID=
YT_API_KEY=
GOOGLE_APPLICATION_CREDENTIALS=
AZURE_STORAGE_CONNECTION_STRING=
AZURE_STORAGE_ACCOUNT_NAME=
AZURE_STORAGE_CONTAINER_NAME=
AZURE_FR_KEY=
AZURE_FR_ENDPOINT=
# MONGO_CONNECTION_URL=
MONGO_NAMESPACE=
PORT=
# BASE_URL=
BASE_URL="http://localhost:7071"
```
## Architecture
![Slide9](https://github.com/NishithP2004/projectx-frontend/assets/34577844/6627ac8a-0653-44bc-b6c9-af4777da391c)
---

## Live Deployment URL
[Project X - Live Deployment](https://projectx.nishithp.dev)

---
