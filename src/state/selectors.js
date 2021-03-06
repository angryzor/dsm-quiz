import config from 'config'
import { getGame } from '../games'

export const getPhase = () => state => state.phase
export const getCurrentGame = () => state => getGame(getCurrentGameType()(state))
export const getCurrentGameType = () => state => config.games[state.currentGame].type
export const getCurrentGameConfig = () => state => config.games[state.currentGame].config
export const getCurrentGameState = () => state => state.gameState
export const getCurrentGameReducer = () => state => getCurrentGame()(state).reducer(getCurrentGameConfig()(state))
export const getCurrentGameRules = () => state => getCurrentGame()(state).rules(getCurrentGameConfig()(state))
export const getCurrentPlayer = () => state => state.currentPlayer
export const getTeams = () => state => state.teams
export const getCountingDown = () => state => state.countingDown
export const getTeam = name => state => state.teams.find(t => t.name === name)
export const getCurrentPlayerTeam = () => state => getTeam(state.currentPlayer)(state)
export const getNamesVisible = () => state => state.namesVisible
