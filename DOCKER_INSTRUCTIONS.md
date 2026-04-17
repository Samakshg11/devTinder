# Dockerization for DevTinder

I have added Docker support to both your Backend and Frontend projects.

### Files Created:
1.  **Backend (`DevTinder/`)**:
    *   `Dockerfile`: Configures the Node.js environment for the backend.
    *   `.dockerignore`: Excludes unnecessary files like `node_modules` from the build.
2.  **Frontend (`DevTinder-web/`)**:
    *   `Dockerfile`: Uses a multi-stage build (builds with Node, serves with Nginx). It also handles the reverse proxying of `/api` requests to the backend.
    *   `.dockerignore`: Excludes unnecessary files.
3.  **Orchestration**:
    *   `docker-compose.yml` (in `DevTinder/`): Orchestrates both services together.

---

### How to Run

Before running, ensure you have **Docker Desktop** installed and running.

#### 1. Start the Application
Open your terminal in the `DevTinder` directory and run:

```bash
docker-compose up --build
```

#### 2. Access the Application
*   **Frontend**: [http://localhost](http://localhost) (Nginx handles the routing)
*   **Backend API**: [http://localhost:3000](http://localhost:3000)

#### 3. Stop the Application
To stop and remove the containers:

```bash
docker-compose down
```

---

### Key Notes
*   **Environment Variables**: The backend container uses your existing `.env` file via `env_file` in `docker-compose.yml`.
*   **Hot Reloading**: The backend has a volume mount (`./src:/app/src`) and uses `nodemon`, so changes to backend code will reflect immediately inside the container.
*   **Nginx Proxy**: The frontend Dockerfile includes an Nginx configuration that proxies `/api` calls to the backend service. This simplifies communication and avoids CORS issues in production environments.
