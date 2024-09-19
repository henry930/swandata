import {useEffect, useState} from 'react'
import {dbUtils} from '../utils/firebase'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import * as cfg from '../utils/variables'

interface Option {
    label: string
    id: string
}
interface SportEditProps {
    id: string
    onChange: (newValue: Option, componentId: string) => void
}

const tableName = 'sports'
const keyName = 'sport_id'

export const SportCell = (_props: {id: string}) => {
  let id = _props.id
    const [data, setData] = useState('')
    const myDb = new dbUtils(tableName,keyName)
    useEffect(() => {
        const getData = async() =>{
            try {
                let res = await myDb.getData(id)
                setData(res.sport_name)
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

export const SportEdit = ({ id , onChange}: SportEditProps) => {
    const [data, setData] = useState<cfg.Sports[]>([])
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
            let arr:Option[] = []
            data.forEach(item=>{
                let res:Option ={label:'',id:''}
                res.label = item.sport_name
                res.id = item.sport_id
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
            renderInput={(params) => <TextField {...params} label="Sport"/>}
          />
    )
  }
