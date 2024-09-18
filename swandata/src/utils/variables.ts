import { CastForEducationRounded } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid'

export interface Trader {
    trader_id: string;
    trader_name: string;
    credit: number;
}
export const getInitValue=(type:string)=>{
  let item:object
  switch(type){
   

    case 'markets':
        item = {
          'market_id':uuidv4(),
          'market_name':''
        }
    break;

    case 'sports':
        item = {
          'sport_id':uuidv4(),
          'sport_name':'',
          'description':''
        }
    break;

    case 'model':
        item = {
          'selection_id':uuidv4(),
          'name':'',
          'event_id':'',
          'fixture_id':'',
          'market_id':'',
          'selection':'',
          'value':'',
          'bottom_price': 0
        }
    break;

    case "events":

      item = {
        'event_id':uuidv4(),
        'event_time':"2023-05-28T12:00:00Z",
        'participants':'',
        'result':'-',
        'score':0,
        'sport_id':"",
        'winner':"-",
        'fixture_id':""  
      }
    break;

    case 'bets':
      item = {
        'bet_id':uuidv4(),
        'selection_id':"",
        'event_id': "",
        'market_id':"",
        'selection':"",
        'bet_time': "",
        'stake_size':1,
        'price':0,
        'value':'',
        'trader_id':"",
        'status':"Betting"
      }
    break;

    default:
    case 'trader':
          item =  {
            'trader_id':uuidv4(),
            'trader_name':'',
            'credit':0
        }
      break;
  }
  return item;
}


export interface Sports {
  sport_id: string;
  sport_name:string;
};

export interface Market {
    market_id: string;
    market_name:string;
};

export interface Model {
    model_id?: number;
    selection_id:string;
    fixture_id: number;
    event_id: string;
    market_id: string;
    selection: string;
    value: string;
    bottom_price: number;
};

export interface Bets {
  bet_id: string;
  fixture_id: number;
  selection_id: string;
  event_id: string;
  market_id: string;
  selection: string;
  bet_time: string;
  stake_size: number;
  price: number;
  value: string;
  trader_id: string;
  status: string;
}

export interface Events {
  event_id:string;
  event_name: string;
  event_time: string;
  participants: string;
  result: string;
  score: number;
  sport_id: string;
  winner: string;
  fixture_id: string;
}
export interface CustomObject {
  [key: string]: any;
}

export const selectionStates = [
  "Win", "Correct score", "Under", "Home", "Draw", "Away", "Over" 
];

export const statusStates = [
  "Betting", "Payout", "Resolve-Win", "Resolve-Loss","Problem"];