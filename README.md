
```markdown
# Node.js TypeScript Starter Project

A professional Node.js project setup with TypeScript, Swagger for API documentation, and a basic MVC folder structure.

## Features

- **TypeScript**: Strongly typed JavaScript for safer and scalable code.
- **Swagger Integration**: Auto-generated API documentation using `swagger-jsdoc` and `swagger-ui-express`.
- **Basic MVC Structure**: Organized folder structure for scalability and maintainability.
- **Express**: Lightweight and fast server framework.


```
## Scripts

- `dev`: Run the app in development mode using `nodemon`.
- `build`: Compile TypeScript files to JavaScript in the `build` directory.
- `start`: Build and run the app in production mode.

## Prerequisites

- **Node.js** >= 20.17.0
- **npm** >= 10.8.2

## Getting Started

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/zainwaseem/nodejs-ts-starter.git
   cd nodejs-ts-starter
   npm install
   ```

2. Run the application in development mode:
   ```bash
   npm run dev
   ```

3. Access Swagger documentation:
   - Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs) in your browser.

4. Build and start in production mode:
   ```bash
   npm run start
   ```

## Swagger Configuration

The Swagger configuration is located in `swagger.json`:

- **Base URL**: `http://localhost:3000/api/v1`
- **APIs**: Routes are defined in `src/routes/*.ts` and documented with JSDoc comments.

## Example API Endpoints

- **GET** `/users` - Retrieve a list of users.
- **POST** `/users` - Create a new user.

## Dependencies

- **Core**: `express`, `swagger-jsdoc`, `swagger-ui-express`
- **Dev**: `typescript`, `ts-node`, `nodemon`, `@types/*`

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Feel free to submit issues and pull requests to improve this starter project.
```