const topProducts = [
    {
        name:'Retirement Fund ',
        value: 92.4,
    },
    {
        name:"Balanced Portfolio",
        value: 85.7,
    },
    {
        name:"Growth ETF",
        value: 78.9,
    },
    {
        name:"Tax-Free Bonds",
        value: 72.3,
    },
    {
        name:"Dividend Stocks",
        value: 68.5,
    }
]
const topBiases = [
    {
        name:'Loss Aversion',
        value: 92.4,
    },
    {
        name:"Recency Bias",
        value: 85.7,
    },
    {
        name:"Confirmation Bias",
        value: 78.9,
    },
    {
        name:"Anchoring Bias",
        value: 72.3,
    },
    {
        name:"Herd Mentality",
        value: 68.5,
    }
]

  
export function valueFormatter(value: number | null) {
  return `${value}%`;
}

export {
    topProducts,
    topBiases
}
