import {useEffect, useState} from 'react'
import {dbUtils} from '../utils/firebase'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import * as cfg from '../utils/variables'

interface Option {
    label: string
    id: string
}

interface TraderEditProps {
    id: string
    onChange: (newValue: Option, componentId: string) => void
  }

const tableName = 'trader'
const keyName = 'trader_id'


export const TraderCell = (_props: {id: string}) => {
  let id = _props.id
    const [data, setData] = useState('')
    const myDb = new dbUtils(tableName,keyName)
    useEffect(() => {
        const getData = async() =>{
            try {
                let res = await myDb.getData(id)
                setData(res.trader_name)
            } catch(e){
                setData('')
            }

        }
        getData()
    }, [])


  return (
        <span>{data}</span>
  )
}

export const TraderEdit = ({ id , onChange}: TraderEditProps) => {
    const [data, setData] = useState<cfg.Trader[]>([])
    const [option, setOption] = useState<Option[]>([])
    
    const [selectedValue, setSelectedValue] = useState<Option>({label:'',id:'0'})
    const myDb = new dbUtils(tableName,keyName)
    
    const handleChange = async (event:any,newValue:any) =>{
        setSelectedValue(newValue)
        onChange(newValue, id)
    }
    useEffect(() => {
        const getData = async() =>{
            let data = await myDb.fetchData()
            console.log(data)
            let arr:Option[] = []
            data.forEach(item=>{
                let res:Option ={label:'',id:''}
                res.label = item.trader_name
                res.id = item.trader_id
                if (res.id == id){
                    setSelectedValue(res)
                }
                arr.push(res)
            })
            setData(data)
            setOption(arr)
        }
        getData()
      }, [])
  
    return (
          <Autocomplete
            disablePortal
            value={selectedValue}
            options={option}
            onChange={handleChange}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Trader"/>}
          />
    )
  }
