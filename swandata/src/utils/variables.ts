
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


export const Tradercolumns =  [
      {
        accessorKey: 'trader_id',
        header: 'Trader ID',
        enableEditing: false,
        size: 50,
      },
      {
        accessorKey: 'trader_name',
        header: 'Trader Name',
        muiEditTextFieldProps: {
          required: true,
        },
        size: 50,
      },
      {
        accessorKey: 'credit',
        header: 'Credit',
        muiEditTextFieldProps: {
          required: true,
        },
        size: 50,
      },
    ]
 


export const MarketColumns =  [
{
    accessorKey: 'market_id', //access nested data with dot notation
    enableEditing: false,
    header: 'Market ID',
    size: 50,
},
{
    accessorKey: 'market_name',
    header: 'Market Name',
    size: 50,
    
},
];

export const selectionStates = [
  "Win", "Correct score", "Under", "Home", "Draw", "Away", "Over" 
];
