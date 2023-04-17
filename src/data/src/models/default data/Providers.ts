import { ProviderResponseModel } from "../../../../api-client";


export const defaultProviders = [
    {
        "name": "Ethereum",
        "color": "#490092",
        "theoreticalMaxTPS": 1428,
        "type": "Mainnet",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Arbitrum One",
        "color": "#920000",
        "theoreticalMaxTPS": 40000,
        "type": "Optimistic rollup",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Optimism",
        "color": "#006ddb",
        "theoreticalMaxTPS": 20000,
        "type": "ZK rollup",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Polygon",
        "color": "#004949",
        "theoreticalMaxTPS": 7200,
        "type": "Application-specific rollup",
        "isGeneralPurpose": false,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "XDAI",
        "color": "#ff6db6",
        "theoreticalMaxTPS": 7000,
        "type": "Application-specific rollup",
        "isGeneralPurpose": false,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "ZKSwap",
        "color": "#c29a2d",
        "theoreticalMaxTPS": 10000,
        "type": "Optimistic rollup",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "ZKSync",
        "color": "#db6d00",
        "theoreticalMaxTPS": 20000,
        "type": "Optimistic rollup",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "AVAX C-chain",
        "color": "#22cf22",
        "theoreticalMaxTPS": 380,
        "type": "Application-specific rollup",
        "isGeneralPurpose": false,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Boba Network",
        "color": "#171723",
        "theoreticalMaxTPS": 20000,
        "type": "Mainnet",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Loopring",
        "color": "#4a1173",
        "theoreticalMaxTPS": 2050,
        "type": "Optimistic rollup",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Aztec",
        "color": "#c6e58",
        "theoreticalMaxTPS": 300,
        "type": "Optimistic rollup",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Immutable X",
        "color": "#1c1e33",
        "theoreticalMaxTPS": 9000,
        "type": "Sidechain",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Metis",
        "color": "#992699",
        "theoreticalMaxTPS": 20000,
        "type": "Mainnet",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Ronin",
        "color": "#5c65cc",
        "theoreticalMaxTPS": 220,
        "type": "Application-specific rollup",
        "isGeneralPurpose": false,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Starknet",
        "color": "#8ae5d6",
        "theoreticalMaxTPS": 0,
        "type": "Optimistic rollup",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Nahmii 2.0",
        "color": "#46004d",
        "theoreticalMaxTPS": 0,
        "type": "Validium",
        "isGeneralPurpose": false,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "OMG Network",
        "color": "#4d2000",
        "theoreticalMaxTPS": 0,
        "type": "State pools",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Gluon",
        "color": "#731152",
        "theoreticalMaxTPS": 0,
        "type": "State pools",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Habitat",
        "color": "#404d00",
        "theoreticalMaxTPS": 0,
        "type": "Mainnet",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Fuel",
        "color": "#9f252f",
        "theoreticalMaxTPS": 2,
        "type": "Mainnet",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Layer2.Finance",
        "color": "#cf4444",
        "theoreticalMaxTPS": 0,
        "type": "Mainnet",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "dYdX",
        "color": "#8c2358",
        "theoreticalMaxTPS": 0,
        "type": "State pools",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Sorare",
        "color": "#265f99",
        "theoreticalMaxTPS": 0,
        "type": "Optimistic rollup",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "DeversiFi",
        "color": "#735445",
        "theoreticalMaxTPS": 0,
        "type": "Optimistic rollup",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Gazelle",
        "color": "#8ab0e5",
        "theoreticalMaxTPS": 0,
        "type": "State pools",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "zkTube",
        "color": "#a75ccc",
        "theoreticalMaxTPS": 0,
        "type": "Optimistic rollup",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Cartesi",
        "color": "#ffe561",
        "theoreticalMaxTPS": 0,
        "type": "Mainnet",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Kchannels",
        "color": "#5ccc8b",
        "theoreticalMaxTPS": 0,
        "type": "Plasma",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Perun",
        "color": "#455473",
        "theoreticalMaxTPS": 0,
        "type": "Plasma",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Raiden Network",
        "color": "#7a8c99",
        "theoreticalMaxTPS": 0,
        "type": "Plasma",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Fantom",
        "color": "#731911",
        "theoreticalMaxTPS": 0,
        "type": "Application-specific rollup",
        "isGeneralPurpose": false,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "ZKSpace",
        "color": "#cc5c9d",
        "theoreticalMaxTPS": 0,
        "type": "Optimistic rollup",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    },
    {
        "name": "Polygon Hermez",
        "color": "#ab5cdb",
        "theoreticalMaxTPS": 0,
        "type": "Optimistic rollup",
        "isGeneralPurpose": true,
        "isSubchainOf": "Ethereum"
    }
] as ProviderResponseModel[]