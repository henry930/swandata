// import data from '../assets/data/markets.json'
import {useEffect, useState} from 'react'
import {TextField,Button, FormGroup, FormControlLabel, Checkbox, FormControl,InputLabel, Select, MenuItem} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Switch from '@mui/material/Switch'
import {dbUtils} from '../utils/firebase'

interface EditProps {
  value: string
  onChange: (newValue:string) => void
}

export const ResultCell = ( {value, onChange }:EditProps) => {
    
    const [open, setOpen] = useState(false)
    const [win,setWin] = useState(false)
    const [place,setPlace]  = useState(false)
    const [odds, setOdds] = useState('-')
    const [score, setScore] = useState('')
    const [goal, setGoal] = useState<number>(0)
    const [card, setCard] = useState<number>(0)
    const [corner, setCorner] = useState<number>(0)
    const [firstScore, setFirstScore] = useState('-')
    const [isResult,setIsResult] = useState(false)
    const [isFirst6th,setIsFirst6th] = useState(false)
    const [isFirst10th,setIsFirst10th] = useState(false)
    const [isFirst15th,setIsFirst15th] = useState(false)
    const [isFirst20th,setIsFirst20th] = useState(false)
    const [isSecond6th,setIsSecond6th] = useState(false)
    const [isSecond10th,setIsSecond10th] = useState(false)
    const [isSecond15th,setIsSecond15th] = useState(false)
    const [isSecond20th,setIsSecond20th] = useState(false)

    const [json,setJson] = useState({})
    useEffect(() => {
      if (!value && !isResult)
        setJson({})
      else {
        try {
          let json = JSON.parse(value)
          setIsResult(json.isResult)
          setWin(json.win)
          setPlace(json.place)
          setOdds(json.odds)
          setScore(json.score)
          setGoal(json.goal)
          setCard(json.card)
          setCorner(json.corner)
          setFirstScore(json.firstScore)
          setIsFirst6th(json.firstInning['6th'])
          setIsFirst10th(json.firstInning['10th'])
          setIsFirst15th(json.firstInning['15th'])
          setIsFirst20th(json.firstInning['20th'])
          setIsSecond6th(json.secondInning['6th'])
          setIsSecond10th(json.secondInning['10th'])
          setIsSecond15th(json.secondInning['15th'])
          setIsSecond20th(json.secondInning['20th'])
          setJson(json)
        }
       catch(e){
          setJson({})
       }   

      }
    }, [])


      const handleClickOpen = () => {
        setOpen(true)
      }

      const handleClose = () => {
        setOpen(false)
      }
      
      const saveJson =() =>{
        let json = {
          isResult: isResult,
          win: win,
          place: place,
          odds: odds,
          score: score,
          goal:goal,
          card: card,
          corner: corner,
          firstScore: firstScore,
          firstInning: {
            '6th': isFirst6th,
            '10th': isFirst10th,
            '15th': isFirst15th,
            '20th': isFirst20th
          }, 
          secondInning: {
            '6th': isSecond6th,
            '10th': isSecond10th,
            '15th': isSecond15th,
            '20th': isSecond20th
          }
         }
         setJson(json)
         let result = JSON.stringify(json)
         onChange(result)
      }
      const handleUpdate = async () =>{
          saveJson()
          handleClose()
      }
      const handleOddsChange = (event:any) => {
          setOdds(event.target.value)
      }
      const handleFirstChange = (event:any) => {
        setFirstScore(event.target.value)
      }
      const handleResult =(e:any, newValue:any) =>{
          setIsResult(newValue)
      }
      
    
  return (
    <>
    <Button
    variant="contained" onClick={handleClickOpen} color={(isResult)?'success':'primary'}
  >
    Update Result
</Button>
 <Dialog
 open={open}
 onClose={handleClose}
 PaperProps={{
   component: 'form',
   onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
     event.preventDefault()
     handleClose()
   },
 }}
>
    <DialogTitle>Result Updates</DialogTitle>
        <DialogContent>

          <FormControlLabel control={<Switch checked={isResult} onChange={handleResult}/>} label="Have the result came yet?" />
          
          {
            isResult &&(  
            <div>
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={win}  onChange={(event) => setWin(event.target.checked)}/>} label="Win" />
              <FormControlLabel control={<Checkbox checked={place}  onChange={(event) => setPlace(event.target.checked)} />} label="Place" />
            </FormGroup>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Match Odds</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={odds}
                label="Match Odds"
                onChange={handleOddsChange}
              >
                <MenuItem value={'-'}>-</MenuItem>
  
                <MenuItem value={'Home'}>Home</MenuItem>
                <MenuItem value={'Away'}>Away</MenuItem>
                <MenuItem value={'Draw'}>Draw</MenuItem>
              </Select>
            </FormControl>
  
            <FormControl fullWidth>
              <DialogContentText>
                  Correct Score
              </DialogContentText>
              <TextField value={score} placeholder="Home-Away" onChange={(event) => setScore(event.target.value)} />
              <DialogContentText>
                  Total Goals
              </DialogContentText>
                <input type="number" value={goal} onChange={(event) => setGoal(parseInt(event.target.value))} placeholder="Please input number only" />
              <DialogContentText>
                  Total Cards
              </DialogContentText>
              <input type="number" value={card} onChange={(event) => setCard(parseInt(event.target.value))} placeholder="Please input number only" />
              <DialogContentText>
                  Total Corners
              </DialogContentText>
              <input type="number" value={corner} onChange={(event) => setCorner(parseInt(event.target.value))} placeholder="Please input number only" />
              <DialogContentText>
                  First Team to score
              </DialogContentText>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={firstScore}
                  label="Match Odds"
                  onChange={handleFirstChange}
                >
                  <MenuItem value={'-'}>-</MenuItem>
  
                  <MenuItem value={'Home'}>Home</MenuItem>
                  <MenuItem value={'Away'}>Away</MenuItem>
                  <MenuItem value={'Draw'}>Draw</MenuItem>
                </Select>
  
                <DialogContentText>
                  Total runs over first innings
                </DialogContentText>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={isFirst6th} onChange={(event) => setIsFirst6th(event.target.checked)}/>} label="6th" />
                  <FormControlLabel control={<Checkbox checked={isFirst10th} onChange={(event) => setIsFirst10th(event.target.checked)}/>} label="10th" />
                  <FormControlLabel control={<Checkbox checked={isFirst15th} onChange={(event) => setIsFirst15th(event.target.checked)}/>} label="15th" />
                  <FormControlLabel control={<Checkbox checked={isFirst20th} onChange={(event) => setIsFirst20th(event.target.checked)}/>} label="20th" />
                </FormGroup>
                <DialogContentText>
                  Total runs over second innings
                </DialogContentText>
                <FormGroup>
                  <FormControlLabel control={<Checkbox checked={isSecond6th} onChange={(event) => setIsSecond6th(event.target.checked)}/>} label="6th" />
                  <FormControlLabel control={<Checkbox checked={isSecond10th} onChange={(event) => setIsSecond10th(event.target.checked)}/>} label="10th" />
                  <FormControlLabel control={<Checkbox checked={isSecond15th} onChange={(event) => setIsSecond15th(event.target.checked)}/>} label="15th" />
                  <FormControlLabel control={<Checkbox checked={isSecond20th} onChange={(event) => setIsSecond20th(event.target.checked)}/>} label="20th" />
                </FormGroup>
  
            </FormControl>
            </div>)
          }



        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogActions>
</Dialog>
</>
  )
}


export const ResultEdit = ({value, onChange }:EditProps) => {


  return (
    <Button
    variant="contained"
    onClick={() => {
     
    }}
  >
Update Result
</Button>
  )
}

