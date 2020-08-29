import React, { useEffect } from 'react'
import Loader from 'rsuite/lib/Loader'
import Panel from 'rsuite/lib/Panel'
import { Link } from 'react-router-dom'
import Col from 'rsuite/lib/Col'
import Helmet from 'react-helmet'
import { useSelector, useDispatch } from 'react-redux'
import FlexboxGrid from 'rsuite/lib/FlexboxGrid'
import * as ACTIONS from '../../reducers/battleReducer'
import OverallStats from './components/BattleOverallStats'
import moment from 'moment'
import TotalPlayerStats from './components/TotalPlayerStats'
import reactga from 'react-ga'
import TotalKillStats from './components/TotalKillStats'
import TotalFameStats from './components/TotalFameStats'
import AllianceTable from './components/AllianceTable'
import GuildTable from './components/GuildTable'
import PlayerTable from './components/PlayerTable'
import BattleMVPs from './components/BattleMVPs'

const formatName = (alliances) => {
    if (alliances.length < 1) {
        return "Unallied"
    }
    if (alliances.length > 4) {
        return `${alliances.slice(0, 3).join(', ')} and ${alliances.slice(4, alliances.length).length} more`
    }
    return alliances.join(', ')
}

const formatDescription = ({alliances, time, kills, players}) => {
    const string = `Battle: ${formatName(alliances)} at ${time} - ${players} players and ${kills} kills`
    return string
}

const BattleLog = props => {
    const battle = useSelector(ACTIONS.getBattle)
    const loading = useSelector(ACTIONS.getLoadingBattle)
    const error = useSelector(ACTIONS.getError)
    const dispatch = useDispatch()
    const { id } = props.match.params


    useEffect(() => {
        reactga.pageview(`/battles/${id}`)
    },[id])

    useEffect(() => {
        dispatch(ACTIONS.fetchBattle(id))
        return function cleanup() {
            dispatch(ACTIONS.unsetBattle())
        };
    }, [dispatch, id])

    if (error) {
        return (
            <Panel
                style={{
                    padding: "4rem",
                    width: "100%",
                    maxWidth: 450,
                    backgroundColor: "#0f131a",
                    textAlign: 'center',
                    margin: "auto",
                }}
                bodyFill
                shaded
            >
                <p style={{ marginBottom: "2rem" }}>{error}</p>
                <Link
                    style={{
                        color: "#34c3ff",
                        textDecoration: 'none',
                    }}
                    to="/battles" >Return to Battle Index</Link>
            </Panel>
        )
    }

    if (loading) {
        return (
            <div>
                <Col style={{ height: "5vh" }} smHidden />
                <Panel
                    style={{
                        backgroundColor: "#0f131a",
                        maxWidth: 300,
                        textAlign: 'center',
                        margin: "auto",
                    }}
                    bodyFill
                    shaded
                >
                    <Loader size="sm" />
                </Panel>
            </div>
        )
    }

    return (
        <div>
            <Helmet>
                <title>{`Battle Report - ${battle.id}`}</title>
                <meta name="description" content={`${formatDescription({
                    alliances: battle.alliances.list,
                    kills: battle.totalKills,
                    time: moment(battle.startTime).add(7, 'hours').format('MM-DD: HH:mm'),
                    players: battle.players.players.length
                })}`} />
            </Helmet>
            <div
                style={{ minHeight: 600 }}
            >
                <div style={{textAlign: 'right'}}>
                    <Link to="/">Return to index</Link>
                </div>
                <FlexboxGrid>
                    <FlexboxGrid.Item style={{ marginBottom: "1rem" }} componentClass={Col} lg={6} md={12} xs={24}>
                        <OverallStats />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ marginBottom: "1rem" }} componentClass={Col} lg={6} md={12} xs={24}>
                        <TotalPlayerStats />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ marginBottom: "1rem" }} componentClass={Col} lg={6} md={12} xs={24}>
                        <TotalKillStats />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ marginBottom: "1rem" }} componentClass={Col} lg={6} md={12} xs={24}>
                        <TotalFameStats />
                    </FlexboxGrid.Item>
                </FlexboxGrid>
                {<BattleMVPs battle={battle} />} 
                <FlexboxGrid>
                    <FlexboxGrid.Item style={{ marginBottom: "1rem" }} componentClass={Col} xs={24}>
                        <AllianceTable
                            alliances={battle.alliances.alliances}
                        />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ marginBottom: "1rem" }} componentClass={Col} xs={24}>
                        <GuildTable
                            guilds={battle.guilds.guilds}
                        />
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item style={{ marginBottom: "1rem" }} componentClass={Col} xs={24}>
                        <PlayerTable
                            players={battle.players.players}
                        />
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
        </div>
    )
}

export default BattleLog