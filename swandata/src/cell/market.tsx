import data from '../assets/data/markets.json'

interface Market {
    market_id: number;
    market_name: string;
}


export function marketCache(){
    let id: number;
    const json: { [key: string]: Market } = {};
    for (let i=0; i<data.length; i++){
        id = data[i].market_id 
        json[id] = data[i]
    }
    return json;
}

const MarketCell = (_props: {id: number}) => {
  let id = _props.id;
  let market = marketCache();
  return (
        <span>{market[id].market_name}</span>
  );
};

export default MarketCell;
