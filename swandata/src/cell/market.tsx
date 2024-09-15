// import data from '../assets/data/markets.json'
import {useEffect, useState} from 'react'
import {rtdb} from '../utils/firebase'
import { ref, child,get, set, remove} from 'firebase/database'; // If using Realtime Database
import * as cfg from '../utils/variables';

interface Market {
    market_id: number;
    market_name: string;
}

type dataType = cfg.Market
const tableName = 'markets'
const keyName = 'market_id'

const fetchData = async () => {
    const snapshot = await get(ref(rtdb, tableName));
    const data: dataType[] = [];
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val() as dataType;
      childData[keyName] = childSnapshot.key;
      data.push(childData);
    });
    return data;
  };



const MarketCell = (_props: {id: string}) => {
  let id = _props.id;
    const [data, setData] = useState('');
    useEffect(() => {
        const getData = async(id:string) =>{
            const dbRef = ref(rtdb, tableName+'/'+id); // Replace 'database' with your database reference
            let snapshot = await get(dbRef)
            if (snapshot.exists()) {
                console.log(snapshot.val())
                setData(snapshot.val()['market_name'])
              } else {
                console.log("No data exists for ID:", id, "in table:", tableName);
                setData('')
              }

            // setData(value['market_name'])
        }
        getData(id);
      }, []);


  return (
        <span>{data}</span>
  );
};

export default MarketCell;
