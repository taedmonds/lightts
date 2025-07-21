# LightTs

<center>
<pre>
   __   _      __   __ ______  
  / /  (_)__ _/ /  / //_  __/__
 / /__/ / _  / _ \/ __// / (_-<
/____/_/\_, /_//_/\__//_/ /___/
       /___/   
</pre>
</center>

A lightweight, native Node.js framework inspired by NestJS, designed to keep things simple, transparent, and customizable. LightTs (also usable via the `lts` command) leverages the power of Node.js and Express while providing a CLI tool to streamline project setup and feature integration, without hiding code behind complex abstractions like decorators. With LightTs, you get clean, editable code that you can tweak to your heart's content.

## Why LightTs?

LightTs is built for developers who want a framework that feels like raw Node.js but with the structure and convenience of a modern framework. Unlike other frameworks that rely heavily on decorators or rigid patterns, LightTs generates straightforward, native Node.js code that you can easily modify. For example, adding a feature like JWT authentication creates an `auth.ts` file with a simple function using the `jsonwebtoken` library—no magic, just code you can read and edit.

## Features

- **Simple CLI Tool**: Initialize projects, generate components, and add features with an intuitive CLI inspired by NestJS.
- **Native Node.js**: Uses standard libraries like `express` and `jsonwebtoken`, keeping everything transparent and customizable.
- **Flexible File Generation**: Choose between Angular-style (`auth.service.ts`) or regular (`auth.ts`) file naming conventions.
- **Built-in Response and Error Classes**: Streamline API responses and error handling with lightweight, reusable classes.
- **Feature Integration**: Add features like JWT, CORS, validation, or TypeORM database support with a single command.
- **Code Quality Tools**: Optional setup for ESLint, Prettier, and Husky to keep your codebase clean.
- **Database Support**: Integrate TypeORM with PostgreSQL, MySQL, MariaDB, or MongoDB, complete with migrations, seeders, and dummy data options.

## Installation

Install LightTs globally to use the CLI:

```bash
npm install -g lightts
```

Or use it directly with `npx`:

```bash
npx lightts
```

You can use either `lightts` or `lts` as the command:

```bash
lts init
```

## Usage

### Initialize a New Project

Create a new API project with the `init` command:

```bash
lts init
```

This will prompt you to configure:
- **Project Name**: Name your project (e.g., `epic-api`).
- **File Naming Style**: Choose Angular-style (`auth.service.ts`) or regular (`auth.ts`).
- **Features**: Select from JWT, CORS, validation, or database integration.
- **Database Options**: If database is selected, choose PostgreSQL, MySQL, MariaDB, or MongoDB, and configure migrations, seeders, or dummy data.
- **Code Quality Tools**: Opt for ESLint, Prettier, and/or Husky.
- **Package Manager**: Pick npm, Yarn, or pnpm.

### Generate Components

Generate controllers, services, validators, or resources:

```bash
lts generate controller user
lts g service auth
lts g validate user
lts g resource product
```

Supported component types:
- `c/controller`: Creates a controller for handling HTTP requests.
- `s/service`: Creates a service for business logic.
- `v/validate`: Creates a validation schema or function.
- `r/resource`: Creates a full resource (controller, service, etc.).

### Add Features

Add features like JWT, CORS, validation, or database support:

```bash
lts add jwt
lts a database
```

This generates feature-specific files (e.g., `auth.ts` for JWT) using standard Node.js libraries, making customization straightforward.

## Built-in Utilities

LightTs provides lightweight classes for consistent API responses and error handling.

### Response Classes

#### `DataResponse`
For sending data with an optional message and metadata.

```typescript
import { DataResponse } from '@/core/responses/data.response';

app.get('/users', (req, res) => {
  const users = [{ id: 1, name: 'John Doe' }];
  return new DataResponse(res, {
    data: users,
    message: 'Users retrieved successfully',
    statusCode: 200,
    meta: { total: users.length }
  });
});
```

#### `MessageResponse`
For sending a message without data, useful for operations like deletes or updates.

```typescript
import { MessageResponse } from '@/core/responses/message.response';

app.delete('/users/:id', (req, res) => {
  return new MessageResponse(res, {
    message: 'User deleted successfully',
    statusCode: 200
  });
});
```

### Error Classes

Handle errors consistently with built-in error classes.

#### `BadRequestError`
For 400 Bad Request errors.

```typescript
import { BadRequestError } from '@/core/error/bad-request.error';

app.post('/users', (req, res, next) => {
  if (!req.body.name) {
    throw new BadRequestError('Name is required', { field: 'name' });
  }
  // Proceed with logic
});
```

#### Other Error Classes
LightTs includes additional error classes for common HTTP errors:
- `ConflictError` (409): For resource conflicts, e.g., duplicate entries.
- `ForbiddenError` (403): For access denied scenarios.
- `NotFoundError` (404): For resources that can't be found.
- `ServerError` (500): For unexpected server errors.
- `UnauthorizedError` (401): For authentication failures.

Each error class accepts a `message` and optional `details` for more context.

## Conventions

- **File Naming**: Uses kebab-case (e.g., `user-controller.ts`).
- **Functions & Variables**: Uses camelCase (e.g., `getUserById`).
- **Generated Code**: Simple, native Node.js code with minimal abstractions for easy customization.

## Example Project Structure

After running `lts init` and adding features, your project might look like:

```
epic-api/
├── node_modules
├── src/
│   ├── config.ts
│   ├── core/
│   │   ├── cors.core.ts
│   │   ├── errors/
│   │   │   ├── bad-request.error.ts
│   │   │   ├── conflict.error.ts
│   │   │   ├── forbidden.error.ts
│   │   │   ├── handler.error.ts
│   │   │   ├── index.ts
│   │   │   ├── not-found.error.ts
│   │   │   ├── server-error.error.ts
│   │   │   └── unauthorized.error.ts
│   │   ├── logger.core.ts
│   │   └── responses/
│   │       ├── data.response.ts
│   │       ├── index.ts
│   │       └── message.response.ts
│   ├── database/
│   │   ├── dummy/
│   │   │   ├── index.ts
│   │   │   └── scripts/
│   │   ├── entities/
│   │   ├── index.ts
│   │   ├── migrations/
│   │   └── seeders/
│   │       ├── index.ts
│   │       └── scripts/
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── validator.middleware.ts
│   ├── modules/
│   │   └── hello/
│   │       ├── hello.controller.ts
│   │       ├── hello.schema.ts
│   │       └── hello.service.ts
│   ├── routes.ts
│   └── types/
│       └── express.d.ts
├── tsconfig.json
├── eslint.config.js
├── index.ts
├── package.json
└── pnpm-lock.yaml
```

## Extending Features

As LightTs evolves, new features can be added via the `lts add` command. These will generate customizable files using standard Node.js libraries, ensuring you can always modify the generated code to suit your needs. Check the [LightTs documentation](https://github.com/taedmonds/lightts) for updates on new features.

## Contributing

You are welcome for contributions! Fork the repo, create a branch, and submit a pull request with your changes. Make sure to follow the coding conventions and add tests where applicable.

## License

MIT License. See [LICENSE](LICENSE) for details.