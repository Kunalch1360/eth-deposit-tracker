
# ETH Deposit Tracker

This repository contains an ETH deposit tracker that listens for deposit events of beacon contract on the Ethereum network using Alchemy, stores deposit data in a MongoDB database, and provides a frontend interface for viewing the details of each deposit.

## Features

- Listens to Ethereum `DepositEvent` events using Alchemy.
- Stores deposit data, including gas fees, in MongoDB.
- Displays all deposit details in a user-friendly MUI table on the frontend.

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v16+)
- **Docker** (optional but recommended for local development)
- **MongoDB** (local installation or MongoDB Atlas account)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/kunalch1360/eth-deposit-tracker.git
cd eth-deposit-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and provide the following environment variables:

```plaintext
ALCHEMY_API_KEY=your-alchemy-api-key
MONGO_URI=mongodb://localhost:27017/your-db-name # or your MongoDB Atlas URI
```

- `ALCHEMY_API_KEY`: Your Alchemy API key to connect to Ethereum.
- `MONGO_URI`: The connection string to your MongoDB instance.

### 4. Running with Docker (Optional)

To simplify the setup, you can use Docker to run the application along with a MongoDB container.

- Build and run the application using Docker Compose:

```bash
docker build -t next-app .
docker run -p 3000:3000 next-app
```

This will Build and run your Docker container.

### 5. Running Locally

To run the service locally without Docker:

- Start MongoDB (if not using Docker).
- Start the application:

```bash
npm run dev
```

This will start the service on `http://localhost:3000` if port 3000 is not already in use.

### 6. Usage Instructions

#### Backend

- **API URL**: `http://localhost:3000/api/deposits`
- **Endpoints**:
  - **GET** `/api/deposits`: Fetch all deposit details stored in MongoDB.
  - **POST** `/api/deposits`: Start listening for deposit events on the Ethereum network.

#### Frontend

The frontend is a simple React.js application that displays all deposit details fetched from the API in a Material UI (MUI) table. The columns include:

- `Block Number`
- `Block Timestamp`
- `Fee`
- `Transaction Hash`
- `Public Key`

To access the frontend, simply navigate to `http://localhost:3000` in your browser.

### 7. Stopping the Service

If you are running the service with Docker, you can stop it with:

```bash
docker-compose down
```

For local development, simply stop the Node.js server with `Ctrl+C`.

## Additional Notes
  
- **Error Handling**: Ensure that proper error handling is in place in case of issues with the Alchemy connection or MongoDB.
