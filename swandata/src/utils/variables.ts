
export interface Trader {
    trader_id: string;
    trader_name: string;
    credit: number;
}

export interface Market {
    market_id: string;
    market_name:string;
};

export interface Model {
    model_id?: number;
    selection_id:string;
    fixture_id: number;
    market_id: string;
    selection: string;
    value: string;
    bottom_price: number;
};

export interface CustomObject {
  [key: string]: any;
}



export const selectionStates = [
  "Win", "Correct score", "Under", "Home", "Draw", "Away", "Over" 
];
