# Node.js recruitment task

## Prerequisites

Please ensure you have `docker` and `docker-compose` installed so as to be able to run this project

## Quickstart

Step 1: Clone the app from the `dev` branch

Step 2: In the root of the cloned project run the below command

```
OMDB_API_KEY=your_omdb_api_key docker-compose up
```

## Testing

### Unit Testing

In the root of the cloned project, run:

```
docker-compose -f docker-compose.unit.test.yml up
```

### Integration Testing

In the root of the cloned project, run:

```
OMDB_API_KEY=your_api_key docker-compose -f docker-compose.integration.test.yml up
```

## Architecture

The auth server serves the purpose of both an auth server and an api gateway. All requests to other services (the movie servie in this case) is routed through the auth server. 
### Why

- It helps to achieve separation of concerns. The auth sever does auth and should do it well while the movie server creates and fetches movies; it should also focus on that and do it well. 

- Secondly, having the auth server as an API gateway that also authorizes users helps us to avoid unncessary requests reaching other services (for instance an aunauthorized user trying to create a movie will be rejected at the API gateway without reaching the movie service at all); thus helping to control the load on the movie service.

## POSTMAN Collection

See Docs folder for the postman collection. Simply import it into postman and start the server (see Quickstart above). Then you can start sending requests 
