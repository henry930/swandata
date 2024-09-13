import data from '../assets/data/traders.json'

interface Trader {
    trader_id: string;
    trader_name: string;
}


export function tradersCache(){
    let item: Trader;
    let id: string;
    const json: { [key: string]: Trader } = {};
    for (let i=0; i<data.length; i++){
        id = data[i].trader_id 
        json[id] = data[i]
    }
    return json;
}

const TraderCell = (_props: {id: string}) => {
  let id = _props.id;
  let traders = tradersCache();
  return (
        <span>{traders[id].trader_name}</span>
  );
};

export default TraderCell;
