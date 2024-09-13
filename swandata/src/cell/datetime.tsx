import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

function Picker() {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateTimePicker']}>
          <DateTimePicker label="Basic date time picker" />
        </DemoContainer>
      </LocalizationProvider>
    );
  }

  const DateTimeCell = (_props: {datetime: string}) => {
    let datetime = _props.datetime;
    
    return (
          <Picker />
    );
  };
  
  export default DateTimeCell;