import type { Plugin } from "@elizaos/core";
import { SEIACTION } from "./actions/SEIAction";
import { seiPricetProvider } from "./providers/SEIProvider";




export const SEIPlugin: Plugin = {
    name: "SEI",
    description: "Plugin which helps you find the Price for the SEI Token using chainlink ABI",
    actions: [SEIACTION    ],
    evaluators: [],
    providers: [seiPricetProvider],
};
export default SEIPlugin;
