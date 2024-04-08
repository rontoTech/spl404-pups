# SPL404 Token Standard 

## Overview

The SPL404 Token Standard represents an innovative approach to digital assets on the Solana blockchain, blending the distinctive characteristics of Non-Fungible Tokens (NFTs) with the flexibility of fungible tokens. This standard introduces a groundbreaking feature: native fractionalization of NFTs, enabling both unique identification and divisible ownership. This README outlines the technical specifications, design principles, and use cases of the SPL404 standard.

## Features

- **Hybrid Token Model**: Combines NFT uniqueness with fungible token divisibility, allowing for broader use cases.
- **Native Fractionalization**: Enables an NFT to be owned fractionally by multiple parties without needing external smart contracts or systems.
- **Seamless Market Integration**: Facilitates trading on both NFT marketplaces and Decentralized Exchanges (DEXs) as well as Centralized Exchanges (CEXs), providing unparalleled liquidity and accessibility.
- **Enhanced Metadata**: Supports rich metadata for AR integration, including geospatial coordinates for immersive experiences.
- **Compatibility**: Designed to be fully compatible with existing Solana wallets, marketplaces, and DeFi protocols.

## Design Principles

### Immutable Metadata

Specific Metadata parts for each SPL404 token are stored immutably on-chain, ensuring the permanence and integrity of data such as unique identifiers.

### Mutable Metadata

Several Metadata parts like geo-spatial coordinates are mutable that helps to add gamification options for the NFT.

### Decentralized Ownership

The fractional ownership model is built on a decentralized architecture, enabling a trustless ecosystem for owners to trade and manage their stakes without third-party intermediary.

### Scalability

Leverages Solana's high throughput and low transaction costs to ensure scalability, making it suitable for widespread adoption in the GameFi and AR sectors.

### Security

Adopts best practices in smart contract security, with audits conducted by leading blockchain security firms to ensure the safety of assets.

## Technical Specification

### Smart Contract Architecture

- **Token Creation**: Details the process of minting new SPL404 tokens, including metadata assignment and initial ownership.
- **Fractional Ownership**: Explains the mechanism for dividing ownership stakes, transferring fractions, and managing permissions.
- **Marketplace Integration**: Describes the APIs and hooks for marketplace platforms to list, sell, and trade SPL404 tokens.

### Metadata Structure

```json
{
  "name": "$PUPS",
  "description": "The first SPL404 geo-spatial enabled token in Solana Metaverse",
  "image": "*TBA",
  "attributes": [
    {
      "trait_type": "Country",
      "value": "Country Name"
    },
    {
      "trait_type": "Population Rank",
      "value": "Numerical Rank"
    }
  ],
  "location": {
    "latitude": "Decimal Latitude",
    "longitude": "Decimal Longitude"
  }
}

```

### Integration with Aspan App
Details on how SPL404 tokens utilize geospatial coordinates for augmented reality applications, including technical requirements for AR display and interaction within the Aspan App.

### Use Cases
- **Collectibles**: Unique, collectible representations of real-world locations and landmarks.
- **GameFi**: Assets within blockchain games that can be owned and traded fractionally.
- **Virtual Real Estate**: Fractional ownership of virtual land or spaces in AR environments.

### Development and Contribution
This project is open for contributions. Developers interested in contributing to the SPL404 standard can submit issues, pull requests, or participate in discussions within this GitHub repository.

### Setup (Soon)

### Testing (Soon)

### License (Soon)