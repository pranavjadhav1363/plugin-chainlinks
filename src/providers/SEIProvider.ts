import { ethers } from 'ethers';
import {
    type IAgentRuntime,
    type Memory,
    type Provider,
    type State,
    elizaLogger,
} from "@elizaos/core";



async function getSEIPrice(): Promise<string | undefined> {
  try {
    // Define the address of the Chainlink SEI/USD Price Feed on Arbitrum Mainnet
const SEI_USD_FEED_ADDRESS = '0xCc9742d77622eE9abBF1Df03530594f9097bDcB3'; // Replace with the full contract address

// Define the Arbitrum Mainnet RPC URL
const ARBITRUM_MAINNET_RPC_URL = 'https://arb1.arbitrum.io/rpc';

// Create a provider to interact with the Ethereum network
const provider = new ethers.JsonRpcProvider(ARBITRUM_MAINNET_RPC_URL);

// Define the ABI for the Chainlink Price Feed contract
const priceFeedABI = [
  'function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
];

// Create a contract instance for the Chainlink Price Feed
const priceFeed = new ethers.Contract(SEI_USD_FEED_ADDRESS, priceFeedABI, provider);

    // Fetch the latest price data from the Chainlink Price Feed
    const latestRoundData = await priceFeed.latestRoundData();

    // Extract the price (answer) from the returned data
    const price: bigint = latestRoundData.answer;

    // Convert the price from its original format to a human-readable number
    const adjustedPrice: number = Number(price) / 1e8;

    // Log the SEI price formatted to 5 decimal places
    const priceString = `SEI Price: $${adjustedPrice.toFixed(5)}`;
    console.log(priceString);
    return priceString;
  } catch (error) {
    // Handle any errors that occur during the fetch operation
    console.error('Error fetching SEI price:', error);
  }
}




const seiPricetProvider: Provider = {
    get: async (
        runtime: IAgentRuntime,
        _message: Memory,
        _state?: State
    ): Promise<string | undefined |null> => {
        try {
           const Price =  await getSEIPrice();
           return Price;
        } catch (error) {
            elizaLogger.error("Error in wallet provider:", error);
            return null;
        }
    },
};

export { seiPricetProvider };