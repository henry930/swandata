
import {dbUtils} from '../utils/firebase'

export const resolveBet = async (id:string) =>{
    // Get record from bet_id
    // Check the betting event/ fixture result
    // If no result come, return with alert 
    // If result come, calculate profit / loss 
    // Update credit by profit/ loss on the trader account


    let betsDb = new dbUtils('bets','bet_id')
    let traderDb = new dbUtils('traders','trader_id')
    let eventDb = new dbUtils('events','event_id')
    let modelDb =new dbUtils('model','selection_id')

    let betRecord = await betsDb.getData(id)
    let event_id = betRecord['event_id']
    let selection_id = betRecord['selection_id']
    let trader_id = betRecord['trader_id']
    let eventRecord = await eventDb.getData(event_id)
    let modelRecord = await modelDb.getData(selection_id)
    let traderRecord = await traderDb.getData(trader_id)
    let profit = 0

    function isWin(){
        return false;
    }

    function isCorrectScore(){
        return false;
    }
    function isUnder(){
        return false;
    }

    function isOver(){
        return false;
    }
    function isHome(){
        return false;
    }
    function isAway(){
        return false;
    }
    function isDraw(){
        return false;
    }
    function updateCredit(){

    }


    // Check status, if not fulfill, then return.
    switch(betRecord['status']) {
        case 'Resolve-Win':
        case 'Resolve-Loss':
            return 'This bet has been resolved.'
        
        case 'Problem':
            return 'This bet has problem. Please read the remark and report to support'
    }

    switch(eventRecord['result']) {
        case '-':
        case '':
            return "Result hasn't come. Please resolve later."
    }

    // Update bettings in different selection sincerio. 
    // Win: Bet Price - Model Bottom Price) * Stack Size 
    // Loss: Assume credit already deduced when betting. Loss no credit deduce
    switch(betRecord['selection']){
        case "Win":  
        // Check the event result whether if it is win. 
            if (isWin())
                updateCredit()
        break;

        case "Correct score":  
        // Check whether the bets value is same as event value, 
            if (isCorrectScore())
                updateCredit()
        break;

        case "Under":
            if (isUnder())
               updateCredit()
        // Check whether the result value is under the bets value. 

        break;

        case "Over":
        // Check whether the result value is over the bets value. 
            if (isOver())
                updateCredit()
        break;

            
        case "Home":
        // Check whether event result if it is Home
            if (isHome())
                updateCredit()
        break;

        case "Draw":
        // Check whether event result if it is Draw
            if (isDraw())
                updateCredit()
        break;
        
        case "Away":
        // Check whether event result if it is Away
            if (isAway())
                updateCredit()
        break;


        default:
            return "Your selection has problems. Please contact your support"
    }

    betRecord['status'] = 'Resolved'
    await betsDb.saveData(id,betRecord)
    return `This bet (${id}) resolved`
}

export const resolveSelectedBets=(ids:Array<string>) =>{

}