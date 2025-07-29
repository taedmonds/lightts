# LightTs

<pre>
   __   _      __   __ ______  
  / /  (_)__ _/ /  / //_  __/__
 / /__/ / _  / _ \/ __// / (_-<
/____/_/\_, /_//_/\__//_/ /___/
       /___/   
</pre>

LightTs is a lightweight, native Node.js framework inspired by NestJS, designed for simplicity, transparency, and customization. Using Express and standard Node.js libraries, it provides a CLI tool (`lightts` or `lts`) to streamline project setup and feature integration, generating clean, editable code without complex abstractions.

## Why LightTs?

LightTs offers the structure of a modern framework with the feel of raw Node.js. It generates straightforward, customizable code (e.g., `auth.ts` for JWT using `jsonwebtoken`) that you can easily modify, avoiding heavy reliance on decorators or rigid patterns.

## Features

- **CLI Tool**: Initialize projects and generate components (controllers, services, validators, resources).
- **Native Node.js**: Built on Express with standard libraries for transparency.
- **File Naming**: Choose Angular-style (`auth.service.ts`) or regular (`auth.ts`).
- **Response & Error Classes**: Simplify API responses and error handling.
- **Feature Integration**: Add JWT, CORS, validation, or TypeORM with one command.
- **Code Quality**: Optional ESLint, Prettier, and Husky setup.
- **Database Support**: TypeORM with PostgreSQL, MySQL, MariaDB, or MongoDB, including migrations and seeders.

## Installation

Install globally:

```bash
npm install -g lightts
```

Or use with `npx`:

```bash
npx lightts
```

Run with `lightts` or `lts`:

```bash
lts init
```

## Usage

### Initialize a Project

```bash
lts init
```

Prompts for project name, file naming style, features (JWT, CORS, etc.), database options, code quality tools, and package manager.

### Generate Components

```bash
lts generate controller user
lts g service auth
lts g validate user
lts g resource product
```

### Add Features

```bash
lts add jwt
lts a database
```

## Documentation

For detailed guides, examples, and API references, visit [lightts.dev](https://lightts.dev).

## Contributing

Contributions are welcome! Fork the repo, create a branch, and submit a pull request. Follow coding conventions and add tests where applicable.

## License

MIT License. See [LICENSE](LICENSE) for details.