import {
    type ActionExample,
    type HandlerCallback,
    elizaLogger,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
    type Action,
    composeContext,
    generateObject,
} from "@elizaos/core";
import { seiPricetProvider } from "../providers/SEIProvider";





export const SEIACTION: Action = {
    name: "SEIACTION",
    similes: [
     "FIND_SEI_PRICE",
     "GET_SEI_PRICE",
        "SEI_PRICE",
        
    ],
    validate: async (_runtime: IAgentRuntime, message: Memory) => {
        elizaLogger.log("Message:", message);
        return true;
    },
    description: "Execute this action to get the price for SEI Token",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        

        try {
           const Price:string = await seiPricetProvider.get(runtime,message,state);
           callback(
            {
                text: `The Price for SEI Token is ${Price}`,
            },
            []
        );
            return true;
        } catch (error) {
            elizaLogger.error("Error during token swap:", error);
            const responseMsg = {
                text: `Error during swap: ${error instanceof Error ? error.message : String(error)}`,
            };
            callback?.(responseMsg);
            return false;
        }
    },
    examples:  [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Can you check the SEI Price?",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Sure, let me check SEI Price.",
                    action: "SEIACTION",
                },
            },
        ],
    ]  as ActionExample[][],
} as Action;