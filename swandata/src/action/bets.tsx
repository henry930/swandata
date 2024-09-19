
import {dbUtils} from '../utils/firebase'
import * as cfg from '../utils/variables'

export const resolveBet = async (id:string) =>{
    // Get record from bet_id
    // Check the betting event/ fixture result
    // If no result come, return with alert 
    // If result come, calculate profit / loss 
    // Update credit by profit/ loss on the trader account


    let betsDb = new dbUtils('bets','bet_id')
    let traderDb = new dbUtils('trader','trader_id')
    let eventDb = new dbUtils('events','event_id')
    let modelDb =new dbUtils('model','selection_id')

    let betRecord = await betsDb.getData(id)
    let event_id = betRecord['event_id']
    let selection_id = betRecord['selection_id']
    let trader_id = betRecord['trader_id']
    let eventRecord = await eventDb.getData(event_id)
    let modelRecord = await modelDb.getData(selection_id)
    let traderRecord = await traderDb.getData(trader_id)
    let result = JSON.parse(eventRecord['result']) || {}
    let marketId = betRecord['market_id']
    let betPrice = betRecord['price']
    let bottomPrice = modelRecord['bottom_price']
    let size = betRecord['stake_size']
    let isBetSuccess = false

    console.log(trader_id, traderRecord)


    async function updateCredit(){
        let earn:number
        earn = size *(betPrice - bottomPrice)
        earn = Number((Math.round(earn * 100) / 100).toFixed(2))
        let credit = Number(traderRecord['credit'])
        credit +=earn
        traderRecord['credit'] = credit
        await traderDb.saveData(traderRecord)
    }


    // Check status, if not fulfill, then return.
    switch(betRecord['status']) {
        case 'Resolve-Win':
        case 'Resolve-Loss':
            return 'This bet has been resolved.'
        
        case 'Problem':
            return 'This bet has problem. Please read the remark and report to support'
    }

    switch(eventRecord['status']) {
        case 'pending':
        case '':
            return "Result hasn't come. Please resolve later."
    }

    if (!result['isResult'])
        return 'No result got. Please contact your support.'

    // Update bettings in different selection sincerio. 
    // Win: Bet Price - Model Bottom Price) * Stack Size 
    // Loss: Assume credit already deduced when betting. Loss no credit deduce
    switch(marketId){
        case cfg._WIN_MARKET_ID:
            if (result['win'])
                isBetSuccess = true
        break;

        case cfg._PLACE_MARKET_ID:
            if (result['place'])
                isBetSuccess = true
        break;

        case cfg._EACH_WAY_MARKET_ID:
            if (result['win']|| result['place'])
                isBetSuccess = true
        break;

        case cfg._MATCH_ODDS_MARKET_ID:
            if (result['odds']== betRecord['selection'])
                isBetSuccess = true
        break;

        case cfg._FIRST_TERM_TO_SCORE_MARKET_ID:
            if (result['firstScore']== betRecord['selection'])
                isBetSuccess = true  
        break;

        case cfg._CORRECT_SCORE_MARKET_ID:
            if (result['score']==betRecord['value'])
                isBetSuccess = true
        break;

        case cfg._TOTAL_GOALS_MARKET_ID:
            switch(betRecord['selection']) {
                case 'Over':
                    if (result['goal']>=parseFloat(betRecord['value']))
                        isBetSuccess = true
                break;

                case 'Under':
                    if (result['goal']<=parseFloat(betRecord['value']))
                        isBetSuccess = true
                break;                
            }
        break;

        case cfg._TOTAL_CARD_MARKET_ID:
            switch(betRecord['selection']) {
                case 'Over':
                    if (result['card']>=parseFloat(betRecord['value']))
                        isBetSuccess = true
                break;

                case 'Under':
                    if (result['card']<=parseFloat(betRecord['value']))
                        isBetSuccess = true
                break;                
            }
        break;

        case cfg._TOTAL_CORNERS_MARKET_ID:
            switch(betRecord['selection']) {
                case 'Over':
                    if (result['corner']>=parseFloat(betRecord['value']))
                        isBetSuccess = true
                break;

                case 'Under':
                    if (result['corner']<=parseFloat(betRecord['value']))
                        isBetSuccess = true
                break;                
            }

        break;

        // To Do
        case cfg._6TH_OVER_FIRST_INNINGS:
        case cfg._10TH_OVER_FIRST_INNINGS:
        case cfg._15TH_OVER_FIRST_INNINGS:
        case cfg._20TH_OVER_FIRST_INNINGS:    
        break;


        case cfg._6TH_OVER_SECOND_INNINGS:
        case cfg._10TH_OVER_SECOND_INNINGS:
        case cfg._15TH_OVER_SECOND_INNINGS:
        case cfg._20TH_OVER_SECOND_INNINGS:    
        break;
        ///////////////

        default:
            return "Your bettings has problems. Please contact your support"+marketId
    }

    if (isBetSuccess) {
        await updateCredit()
        betRecord['status'] = 'Resolved-Win'
    } 
    else
        betRecord['status'] = 'Resolved-Loss'


    await betsDb.saveData(betRecord)
    return `This bet (${betRecord['bet_id']}) resolved`
}

export const resolveSelectedBets=(ids:Array<string>) =>{
    ids.forEach(id=>{
        resolveBet(id)
    })
}