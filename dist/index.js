// src/actions/SEIAction.ts
import {
  elizaLogger as elizaLogger2
} from "@elizaos/core";

// src/providers/SEIProvider.ts
import { ethers } from "ethers";
import {
  elizaLogger
} from "@elizaos/core";
async function getSEIPrice() {
  try {
    const SEI_USD_FEED_ADDRESS = "0xCc9742d77622eE9abBF1Df03530594f9097bDcB3";
    const ARBITRUM_MAINNET_RPC_URL = "https://arb1.arbitrum.io/rpc";
    const provider = new ethers.JsonRpcProvider(ARBITRUM_MAINNET_RPC_URL);
    const priceFeedABI = [
      "function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)"
    ];
    const priceFeed = new ethers.Contract(SEI_USD_FEED_ADDRESS, priceFeedABI, provider);
    const latestRoundData = await priceFeed.latestRoundData();
    const price = latestRoundData.answer;
    const adjustedPrice = Number(price) / 1e8;
    const priceString = `SEI Price: $${adjustedPrice.toFixed(5)}`;
    console.log(priceString);
    return priceString;
  } catch (error) {
    console.error("Error fetching SEI price:", error);
  }
}
var seiPricetProvider = {
  get: async (runtime, _message, _state) => {
    try {
      const Price = await getSEIPrice();
      return Price;
    } catch (error) {
      elizaLogger.error("Error in wallet provider:", error);
      return null;
    }
  }
};

// src/actions/SEIAction.ts
var SEIACTION = {
  name: "SEIACTION",
  similes: [
    "FIND_SEI_PRICE",
    "GET_SEI_PRICE",
    "SEI_PRICE"
  ],
  validate: async (_runtime, message) => {
    elizaLogger2.log("Message:", message);
    return true;
  },
  description: "Execute this action to get the price for SEI Token",
  handler: async (runtime, message, state, _options, callback) => {
    try {
      const Price = await seiPricetProvider.get(runtime, message, state);
      callback(
        {
          text: `The Price for SEI Token is ${Price}`
        },
        []
      );
      return true;
    } catch (error) {
      elizaLogger2.error("Error during token swap:", error);
      const responseMsg = {
        text: `Error during swap: ${error instanceof Error ? error.message : String(error)}`
      };
      callback?.(responseMsg);
      return false;
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Can you check the SEI Price?"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "Sure, let me check SEI Price.",
          action: "SEIACTION"
        }
      }
    ]
  ]
};

// src/index.ts
var SEIPlugin = {
  name: "SEI",
  description: "Plugin which helps you find the Price for the SEI Token using chainlink ABI",
  actions: [SEIACTION],
  evaluators: [],
  providers: [seiPricetProvider]
};
var index_default = SEIPlugin;
export {
  SEIPlugin,
  index_default as default
};
//# sourceMappingURL=index.js.map