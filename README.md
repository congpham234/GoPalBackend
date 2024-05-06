### How to run locally:

Step 1: Build the project

```
npm run build
```

Step 2: Then start the server with

```
npm run start
```

The server should be served at port 3000 by default.

---

### How to run on local Docker Container

Step 1: Install Docker.

Step 2: Start the server in docker container

```
docker run --platform linux/amd64 -p 9000:8080 gopalbackend:latest
```

Step 3: To test, open another terminal and run:

```
curl -X Get "http://localhost:9000/v1/delivery"
```

Step 4: To bash into docker container, run:

```
docker run --rm -it --entrypoint /bin/bash gopalbackend:latest
```

---

### How to run on AWS lambda:

Step 1: Build the project

```
npm run build
```

Step 2: Import the `index.zip` file in `dist` folder to AWS lambda
