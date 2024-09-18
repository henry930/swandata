import {useEffect, useState} from 'react'
import {dbUtils} from '../utils/firebase'
import Chip from '@mui/material/Chip';
import { TiDelete } from "react-icons/ti";
import TextField from '@mui/material/TextField';
import * as cfg from '../utils/variables'

interface Option {
    label: string;
    id: string;
}

interface ParticipantEditProps {
    value: string;
    onChange: (newValue: string) => void;
  }


export const ParticipantCell = (_props: {value: string}) => {
  let str = _props.value;
  let arr:Array<string> =[]
  try {
    arr = str.split("|") || []
  } catch(e){
    arr = []
  }
  return (
    <div>
    {arr.map((participant) => ( 
      <Chip label={participant} key={participant} /> 
    ))}
  </div>
  );
};



export const ParticipantEdit = ({ value , onChange}: ParticipantEditProps) => {
  const [text, setText] = useState<string>("");
  const [chips, setChips] = useState<Array<string>>([]);
  const [validationError, setValidationError] = useState("");
  let str: string
  let arr:Array<string>=[]

  useEffect(() => {
    if (value) {
      try {
        arr = value.split("|") || []
      } catch(e){
        arr = []
      }
      setChips(arr)
    }

  }, []);

  function removeChip(chipToRemove:any) {
    // filtering out the chip that the user wants to remove
    const updatedChips = chips.filter((chip) => chip !== chipToRemove);
    setChips(updatedChips);
  }

  function handlePressEnter(e:any) {
  
    if (e.key === "Enter") e.preventDefault();
    if (e.key !== "Enter" || !text) return;
    if (chips.includes(text)) {
      return setValidationError("Cannot add the same input more than once");
    }
    setChips((prevState) => [...prevState, e.target.value]);
    arr = [...chips, e.target.value]
    str = arr.join("|")
    onChange(str)

    setText("");
    setValidationError("");

  }
  function handleRemove(chip:any){
    removeChip(chip)
    str = chips.join("|")
    onChange(str)
  }

  return (
    <div>
      <label htmlFor="tags">Tags</label>
      <div className="input-container">
        <ul className="chips">
          {chips.map((chip) => (
            <li key={chip} className="chip">
              <span>{chip}</span>
              <TiDelete onClick={() => handleRemove(chip)} />
            </li>
          ))}
        </ul>
        <TextField id="tags" label="Participants" variant="filled" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handlePressEnter}/>
        
      </div>
      {validationError && <p className="error-message">{validationError}</p>}
    </div>
  );
}

