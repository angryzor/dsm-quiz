import {
	FOUND_ANSWER, START, STOP, TO_POSTROUND, NEXT_ROUND,
} from './actions'
import { calculateNextPlayerMap, calculatePlayerOrder, dropPlayerFromNextPlayerMap } from '../player-order'
import { PLAYER_ELIMINATED } from '../../state/actions'
import { pluck, sortWith, ascend, prop, descend, indexOf } from 'ramda'

export default ({ questions }) => (state, { type, payload }, { currentPlayer, teams }) => {
	if (state === undefined) {
		const playerOrder = calculatePlayerOrder(teams)
		const nextPlayerMap = calculateNextPlayerMap(playerOrder)

		state = { phase: 'PREROUND', currentQuestion: 0, playerOrder, nextPlayerMap, found: { } }
	}

	switch (type) {
		case NEXT_ROUND: {
			const playerOrder = pluck('name', sortWith([
				ascend(prop('score')),
				descend(team => indexOf(team.name, state.playerOrder)),
			], teams))
			const nextPlayerMap = calculateNextPlayerMap(playerOrder)

			return { ...state, phase: 'PREROUND', currentQuestion: state.currentQuestion + 1, playerOrder, nextPlayerMap, found: { } }
		}
		case START:
			return { ...state, phase: 'THINKING' }
		case STOP:
			return { ...state, phase: 'PLAYER_PREPARATION' }
		case TO_POSTROUND:
			return { ...state, phase: 'POSTROUND', found: Object.fromEntries(questions[state.currentQuestion].answers.map(answer => [answer, true])) }
		case FOUND_ANSWER:
			return { ...state, found: { ...state.found, [payload.answer]: true } }
		case PLAYER_ELIMINATED:
			return {
				...state,
				phase: payload.player === currentPlayer ? 'PLAYER_PREPARATION' : state.phase,
				nextPlayerMap: dropPlayerFromNextPlayerMap(payload.player, state.nextPlayerMap)
			}
		default:
			return state
	}
}