# SAFE-Discovery: Ecosystem discovery platform & SAFE transaction explorer

SAFE-Discovery is an ecosystem discovery platform and transaction explorer designed to provide a user-friendly interface for exploring Safe transactions on the EVM blockchains that are using OP stack. Similar in concept to platforms like Etherscan and Jiffyscan, SAFE-Discovery is optimized specifically for exploring various types of Safe transactions, including multisig transactions, incoming batches, and batched transactions. It enables users to easily preview transaction history of different Safes, facilitating a comprehensive understanding of their activities.

On top of that it provides tools to discover new modules, plugins, hooks and tools in the SAFE ecosystem, learn about them by providing transparent, censorship resistant information about them.

## Features

- **Transaction Exploration**: Easily explore and analyze different types of Safe transactions, including multisig transactions, incoming batches, and batched transactions.

- **Comprehensive Tx History**: Gain insights into the transaction history of different Safes, allowing you to monitor their activities and changes over time.

- **Safe{Core} API Integration**: Built upon the Safe{Core} API for basic data retrieval, with the potential to expand functionality by integrating other data sources.

## Getting Started

To set up and run SAFE-Discovery locally, follow these steps:

1. Clone the repository:

   ```sh
   git clone https://github.com/WorkPod/SAFE-Discovery.git
   cd SAFE-Discovery
   ```

2. Install dependencies:

   ```sh
   yarn
   ```

3. Configure environment varibles:

   - copy `.ev.example` file content to `.env` file and fill out environment variables.

4. Start the development server:
   ```sh
   yarn dev
   ```
   dApp is going to be available in browser: `http://localhost:3000`
