# Throw-away build stage for frontend
FROM oven/bun:1.2 AS build

# Bun app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install frontend node modules
COPY --link frontend ./frontend
RUN cd frontend && bun install

# Change to frontend directory and build the frontend app
WORKDIR /app/frontend
RUN bun run build
# Remove all files in frontend except for the dist folder
RUN find . -mindepth 1 ! -regex '^./dist\(/.*\)?' -delete



# main image - PYTHON
FROM python:3.11

# The installer requires curl (and certificates) to download the release archive
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates

# Download the latest installer
ADD https://astral.sh/uv/0.4.20/install.sh /uv-installer.sh       

# Run the installer then remove it
RUN sh /uv-installer.sh && rm /uv-installer.sh

# Ensure the installed binary is on the `PATH`
ENV PATH="/root/.cargo/bin/:$PATH"
ENV PATH="/app/.venv/bin:$PATH"

WORKDIR /app

ADD ./pyproject.toml ./uv.lock ./

RUN uv sync --frozen

# Copy backend app
COPY ./app ./app

# Copy built frontend
COPY --from=build /app /app

EXPOSE 8000

CMD [ "uv", "run", "fastapi", "run", "app/main.py" ]