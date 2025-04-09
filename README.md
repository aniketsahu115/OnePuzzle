![Home Page](https://github.com/aniketsahu115/OnePuzzle/blob/main/attached_assets/home%20page.png)
![Dashboard](https://github.com/aniketsahu115/OnePuzzle/blob/main/attached_assets/OnePuzzle%20Dashboard.png)
![Blog Section](https://github.com/aniketsahu115/OnePuzzle/blob/main/attached_assets/OnePuzzle%20Blog.png.png)
# OnePuzzle - Daily Chess Puzzles with NFT Rewards

**[Play Now - Live Website](https://onepuzzle.onrender.com/)**

Experience daily chess puzzles and earn NFT rewards for your solutions!

OnePuzzle is a web application that combines chess training with blockchain technology, offering daily chess puzzles and minting successful solutions as NFTs on Solana.

## Features

- Daily Chess Puzzles
- Interactive Chess Board
- NFT Rewards for Puzzle Solutions
- Progress Tracking Dashboard
- Learning Resources
- Educational Content

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Blockchain**: Solana Web3.js
- **Development**: Vite, ESBuild

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Database Setup

Create a new PostgreSQL database:
```bash
create database chess_puzzle
```
Set up your database connection by creating a `.env` file:
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/chess_puzzle
```
## Required Database Packages

```bash
npm install pg           # PostgreSQL client for Node.js
npm install drizzle-orm  # TypeScript ORM
npm install drizzle-kit  # CLI tool for Drizzle ORM
npm install dotenv       # Environment variable management
```

These packages are required for database connectivity and management:
- `pg`: PostgreSQL driver for Node.js
- `drizzle-orm`: Modern TypeScript ORM for better type safety
- `drizzle-kit`: Migration and schema management tools
- `dotenv`: Loads environment variables from .env file

Initialize the database schema:
```bash
npx drizzle-kit push
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/            # Frontend React application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/      # Page components
│   │   ├── lib/        # Utility functions
│   │   └── hooks/      # Custom React hooks
├── server/            # Backend Express server
│   ├── routes.ts      # API routes
│   ├── puzzles.ts     # Puzzle management
│   └── solana.ts      # Blockchain integration
└── shared/            # Shared types and schemas
```

## API Endpoints

- `GET /api/puzzles/today` - Get today's puzzle
- `POST /api/attempts` - Submit puzzle attempt
- `POST /api/nft/mint` - Mint NFT for successful solution
- `POST /api/auth/wallet` - Wallet authentication

## Database Schema
The application uses the following tables:
- `puzzles`: Stores chess puzzles
- `attempts`: Records user attempts
- `users`: User profiles and statistics
- `dailyPuzzles`: Daily puzzle assignments


## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
