# Novel Crawler API

A FastAPI-based API for downloading light novels, built with Python, Dockerized for easy setup, and using Uv for dependency management. This API leverages the [LightNovel Crawler](https://github.com/dipu-bd/lightnovel-crawler/tree/master) for downloading light novels.

## Features

- FastAPI-based REST API for interacting with novel downloading functionality.
- Dockerized setup for easy and reproducible environments.
- Uses Uv for dependency management, ensuring smooth dependency handling.
- Integration with [LightNovel Crawler](https://github.com/dipu-bd/lightnovel-crawler/tree/master) to download novels.

## Prerequisites

Before setting up the project, make sure the following dependencies are installed:

- Docker
- Python 3.11 or higher
- Docker Compose (optional, for local development)

## Setup & Installation

### Option 1: Using Docker (Recommended)

1. Clone this repository:

   ```bash
   git clone https://github.com/UnfetteredScholar/novel-crawler-api.git
   cd novel-crawler-api
   ```

2. Build the Docker image:

   ```bash
   docker build -t novel-crawler-api .
   ```

3. Run the Docker container:

   ```bash
   docker run -d -p 8000:8000 novel-crawler-api
   ```

4. The API will be available at `http://localhost:8000`. You can visit the interactive documentation at `http://localhost:8000/docs`.

### Option 2: Using Virtual Environment

1. Clone this repository:

   ```bash
   git clone https://github.com/UnfetteredScholar/novel-crawler-api.git
   cd novel-crawler-api
   ```

2. Create a virtual environment:

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install dependencies using Uv:

   ```bash
   uv install
   ```

4. Run the FastAPI server:

   ```bash
   uv run fastapi dev
   ```

5. The API will be available at `http://localhost:8000`. Visit `http://localhost:8000/docs` for interactive API documentation.

## API Documentation

Once the server is up and running, you can access the interactive API documentation at:

- `http://localhost:8000/docs` - Swagger UI for API exploration.
- `http://localhost:8000/redoc` - ReDoc for API documentation.

## Endpoints

### `GET /download/{novel_name}`

Download a light novel.

**Path Parameters:**

- `novel_name`: The name of the novel to download.

**Example Request:**

```bash
GET http://localhost:8000/download/novel-name
```

**Response:**

- Success: 200 OK with the download link.
- Failure: 400 Bad Request with an error message.

## Troubleshooting

- Ensure that Docker is properly installed and running for Docker-based setup.
- Check if all dependencies are properly installed if you choose the virtual environment method.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [LightNovel Crawler](https://github.com/dipu-bd/lightnovel-crawler) by dipu-bd for providing the base functionality to download light novels.
- [FastAPI](https://fastapi.tiangolo.com/) for building the API.
