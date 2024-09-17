// import data from '../assets/data/markets.json'
import {useEffect, useState} from 'react'
import {rtdb} from '../utils/firebase'
import { ref, child,get, set, remove} from 'firebase/database'; // If using Realtime Database
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {Box} from '@mui/material'
import top100Films from './top100Film';
import * as cfg from '../utils/variables';

type dataType = cfg.Market
const tableName = 'fixture'
const keyName = 'fixture_id'

interface Option {
   label: string;
   id: string;
   type: string;
}

const FixtureEdit = (_props: {id: string}) => {
  let id = _props.id;
  const [data, setData] = useState<Option[]>([]);

  useEffect(() => {
      const getData = async(id:string) =>{
          const dbRef = ref(rtdb, tableName+'/'+id); // Replace 'database' with your database reference
          let snapshot = await get(dbRef)
          if (snapshot.exists()) {
              console.log(snapshot.val())
              setData(snapshot.val()['market_name'])
            } else {
              console.log("No data exists for ID:", id, "in table:", tableName);
              setData([])
            }

          // setData(value['market_name'])
      }
      getData(id);
    }, []);

  return (
        <Autocomplete
          disablePortal
          options={top100Films}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Fixture" />}
        />
  );
};

export default FixtureEdit;
