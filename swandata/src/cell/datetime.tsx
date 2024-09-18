import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface DateTimeEditProps {
  datetime: string
  onChange: (newValue: Date) => void
}

  export const DateTimeEdit = ({ datetime , onChange}: DateTimeEditProps) => {

    const handleChange = async (newValue:any) =>{
        onChange(newValue.toISOString());
    }
    return (
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker label="Basic date time picker" value={dayjs(datetime)} onChange={handleChange}/>
      </DemoContainer>
    )
  }
  
  export const DateTimeCell = (_props:{ datetime:string}) => {
    let datetime = _props.datetime
    return (
      <DemoContainer components={['DateTimePicker']}>
        <DateTimePicker label="Basic date time picker" value={dayjs(datetime)} disabled/>
      </DemoContainer>
    )
  }
