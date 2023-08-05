# traveltrack
Manage all your itineraries in a single, clean interface. Keep all your receipts and tickets in one place.

## Requirements

### PostgreSQL
traveltrack requires a PostgreSQL database to function. I am developing traveltrack on version 15, though older (and newer) versions should work fine as well. For testing purposes, spin up a PostgreSQL database using the following command:

```bash
docker run -it --rm --name traveltrack-postgres -e POSTGRES_USER=traveltrack -e POSTGRES_PASSWORD=traveltrack -p 5432:5432 -v ~/traveltrack-postgres:/var/lib/postgresql/data postgres:15
```

### Node.js
As an Express.js application, traveltrack requires [Node.js](https://nodejs.org/) to function. It is being built using Node.js 18 (the current LTS version), though many older (and newer) versions should work as well. You can find installation instructions on the Node.js website.

### Dependencies
traveltrack comes with a few common dependencies, like the hbs view engine, Tailwind CSS + daisyUI and node-postgres. To install them, run `npm install`.

### Configuration
Set the following environment variables (or create a .env file) with the following values:

* `DB_HOST`: PostgreSQL host, defaults to `localhost`
* `DB_PORT`: PostgreSQL port, defaults to `5432`
* `DB_NAME`: Database name, defaults to `traveltrack`
* `DB_USER`: Database user, defaults to `traveltrack`
* `DB_PASSWORD`: Database password, defaults to `traveltrack`
* `PORT`: Port the web app listens on, defaults to `3000`
* `PUBLIC_URL`: Base URL of the web app, defaults to `http://localhost:PORT`
* `SECRET`: Secret to sign and verify cookies, defaults to `secret`
* `SESSION_LENGTH`: Session duration in minutes, defaults to `1440`
