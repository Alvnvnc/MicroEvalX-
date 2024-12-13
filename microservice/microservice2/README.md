# Inventory System

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture](#architecture)
   - [Presentation Layer](#presentation-layer)
   - [Business Logic Layer](#business-logic-layer)
   - [Data Access Layer](#data-access-layer)
4. [Layers and Functions](#layers-and-functions)
   - [Infrastructure Layer](#infrastructure-layer)
   - [Data Access Layer](#data-access-layer)
   - [Business Layer](#business-layer)
   - [Helper Layer](#helper-layer)
   - [Web-Program Layer](#web-program-layer)
5. [Getting Started](#getting-started)
6. [Configuration](#configuration)
7. [Tests](#tests)
8. [Contributing](#contributing)
9. [Commit Message Guidelines](#commit-message-guidelines)
10. [License](#license)

## Overview

The Inventory system is designed to manage and automate the tracking of goods and products in a warehouse or store. It helps in keeping track of stock levels, managing inventory orders, and ensuring that the right products are available when needed. The system also provides insights into inventory turnover, sales trends, and helps in optimizing stock levels to reduce costs and improve efficiency.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: The project is currently using Node.js version `v18.X.X`. You must install Node.js to run the server and the development tools. Download it from [Node.js.org](https://nodejs.org/).

- **npm**: This project uses npm as the package manager. The current version in use is `9.8.X`. npm is distributed with Node.js, which means that when you download Node.js, you automatically get npm installed on your computer. Verify that you have it by running `npm -v` in your terminal.

- **MySQL**: The application requires a MySQL database. Ensure you have MySQL installed and running before attempting to connect the application to your database.

- **Sequelize CLI**: The Sequelize Command Line Interface (CLI) is used to manage database migrations and seeders. It's listed as a dev dependency, so running `npm install` should install it locally. However, if you need to install it globally, you can run `npm install -g sequelize-cli`.

- **TypeScript**: The project is written in TypeScript, so you will need to have the TypeScript compiler installed. Running `npm install` will install the TypeScript compiler locally as it is included in the dev dependencies.

- **Other dependencies**: Make sure all dependencies are installed by running `npm install` from the root of the project after cloning it. This will install all packages listed under "dependencies" and "devDependencies" in the `package.json`.

Please check the `package.json` for any other specific versions of the packages to ensure compatibility.

## Architecture

The system is built on a Three-Tier Architecture, ensuring scalability, manageability, and maintainability. This architecture is composed of the Presentation Layer, the Business Logic Layer, and the Data Access Layer.

### Presentation Layer

The Presentation Layer is responsible for presenting the user interface and facilitating user interaction. This layer is where the `web-main` folder comes into play, containing all the necessary files to run the express server and serve the application.

### Business Logic Layer

The Business Logic Layer, found in the `business-layer` folder, contains the application's business logic. It processes the commands issued by the users, applies the business rules, and performs computations.

### Data Access Layer

Contained within the `data-access` folder, the Data Access Layer provides access to the data necessary for the application to function. This layer handles all interactions with the database, ensuring data integrity and security.

## Layers and Functions

### Infrastructure Layer

- **Location**: `infrastructure` folder
- **Function**: This layer includes configuration files, database migrations, seeders, models, and interfaces. It sets up the database and establishes how the application interacts with it.

### Data Access Layer

- **Location**: `data-access` folder
- **Function**: This layer deals with data retrieval and persistence. It abstracts the underlying data source and provides a clean API for the Business Layer to interact with the data.

### Business Layer

- **Location**: `business-layer` folder
- **Function**: Here, the core business logic resides. This layer coordinates the application's operations, enforces rules, and handles decision-making processes.

### Helper Layer

- **Function**: It provides auxiliary functionality that supports the other layers, like shared utilities, validation, or common business rules.

### Web-Program Layer

- **Location**: `web-main` folder
- **Function**: This layer manages the web application's lifecycle, routing, and controllers. It processes HTTP requests and delegates business processing to the Business Layer.

## API Documentation

Our API is fully documented, making it easy for developers to understand and consume the endpoints.

### Postman Collection

For Postman, we have a live document that you can view and use to test the API:

- [Postman API Documentation](https://documenter.getpostman.com/view/30703660/2s9Yyzcxb2)

This document provides detailed examples of request and response payloads, query parameters, HTTP headers, and other important information.

### Swagger Documentation (Upcoming)

We are in the process of setting up Swagger for our API documentation. This will provide an interactive user interface to explore the API, see all available endpoints, and test them directly in the browser.

Please check back soon for the Swagger documentation link.

## Getting Started

To run the Inventory system, follow these steps:

1. Install dependencies:

```shell
npm install
```

2. Set up your environment variables by creating a `.env` file in the root directory with the necessary configurations. Use the `.env.example` as a template.

3. Run the database migrations to set up your database schema:

```shell
npm run migrate
```

4. (Optional) Seed the database with initial data if you have seeders set up:

```shell
npm run seed
```

5. Start the server in development mode:

```shell
npm run dev
```

Or, for a production environment, build the project and start the server:

```shell
npm run build
npm start
```

## Configuration

You may need to configure your database connection settings and other environment-specific variables in the infrastructure/config/config.js file or through environment variables in your .env file.

## Tests

To run the tests, use the following command:

```shell
npm test
```

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Commit Message Guidelines

To maintain a clear and consistent commit history, we follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification and the commit message format proposed by [Karma Runner](https://karma-runner.github.io/6.4/dev/git-commit-msg.html). This helps us to automate the versioning process and to generate a readable changelog.

### Format of the Commit Message

- `Type`: This signifies the type of change you're committing. Common types include:
  - `feat`: A new feature
  - `fix`: A bug fix
  - `docs`: Documentation only changes
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc.)
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `perf`: A code change that improves performance
  - `test`: Adding missing or correcting existing tests
  - `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation
- Example of a commit message: `feat: Add a new feature`

## License

Distributed under the MIT License. See LICENSE for more information. Develop with ❤️ by [Kurniacf](https://github.com/kurniacf)
