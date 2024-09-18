import { Stack } from '@mantine/core'
import { FC, useState } from 'react'
import { useParams } from 'react-router-dom'
import MobileScoreboardTable from '@Components/MobileScoreboardTable'
import ScoreboardTable, { ScoreboardProps } from '@Components/ScoreboardTable'
import TeamRank from '@Components/TeamRank'
import TimeLine from '@Components/TimeLine'
import WithGameTab from '@Components/WithGameTab'
import WithNavBar from '@Components/WithNavbar'
import { useIsMobile } from '@Utils/ThemeOverride'
import { useGameTeamInfo } from '@Utils/useGame'
import { ChallengeCategory } from '@Api'
import { useLocalStorage } from '@mantine/hooks'

const Scoreboard: FC = () => {
  const { id } = useParams()
  const numId = parseInt(id ?? '-1')
  const { teamInfo, error } = useGameTeamInfo(numId)

  const [organization, setOrganization] = useState<string | null>('all')
  const [titlePattern, setTitlePattern] = useLocalStorage({
    key: 'scoreboard-search-pattern',
    defaultValue: '',
    getInitialValueInEffect: false,
  })
  const [category, setCategory] = useState<ChallengeCategory | null>(null)

  const scoreboardProps: ScoreboardProps = {
    organization: organization ?? 'all',
    setOrganization,
    titlePattern,
    setTitlePattern,
    category,
    setCategory,
  }

  const isMobile = useIsMobile(1080)
  const isVertical = useIsMobile()

  return (
    <WithNavBar width="90%" minWidth={0}>
      {isMobile ? (
        <Stack pt="md">
          {teamInfo && !error && <TeamRank />}
          {isVertical ? (
            <MobileScoreboardTable {...scoreboardProps} />
          ) : (
            <ScoreboardTable {...scoreboardProps} />
          )}
        </Stack>
      ) : (
        <WithGameTab>
          <Stack pb="2rem">
            <TimeLine organization={organization ?? 'all'} />
            <ScoreboardTable {...scoreboardProps} />
          </Stack>
        </WithGameTab>
      )}
    </WithNavBar>
  )
}

export default Scoreboard
