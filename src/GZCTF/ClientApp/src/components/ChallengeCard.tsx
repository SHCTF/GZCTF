import {
  Box,
  Card,
  Center,
  Code,
  Divider,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
  alpha,
  useMantineTheme,
} from '@mantine/core'
import { mdiFlag } from '@mdi/js'
import { Icon } from '@mdi/react'
import cx from 'clsx'
import dayjs from 'dayjs'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { BloodsTypes, PartialIconProps, useChallengeCategoryLabelMap, SolveMarkIconMap } from '@Utils/Shared'
import { ChallengeInfo, SubmissionType } from '@Api'
import classes from '@Styles/ChallengeCard.module.css'
import hoverClasses from '@Styles/HoverCard.module.css'
import tooltipClasses from '@Styles/Tooltip.module.css'

interface ChallengeCardProps {
  challenge: ChallengeInfo
  solved?: boolean
  onClick?: () => void
  iconMap: Map<SubmissionType, PartialIconProps | undefined>
  colorMap: Map<SubmissionType, string | undefined>
  teamId?: number
  hideWeekInTitle?: boolean
  solveMark?: string
}

const ChallengeCard: FC<ChallengeCardProps> = (props: ChallengeCardProps) => {
  const { challenge, solved, onClick, iconMap, teamId, colorMap, hideWeekInTitle, solveMark } = props
  const challengeCategoryLabelMap = useChallengeCategoryLabelMap()
  const cateData = challengeCategoryLabelMap.get(challenge.category!)
  const theme = useMantineTheme()

  // was solved || undefined
  const darkenCard = solveMark ? (SolveMarkIconMap[solveMark]?.regardAsSolved || undefined) : solved || undefined

  // was solved
  const showMark = solveMark ? solveMark !== "(空白)" : solved

  // was <Icon size={1} path={mdiFlag} />
  const markIcon = solveMark === undefined
    ? <Icon size={0.9} path={mdiFlag} />
    : Object.keys(SolveMarkIconMap).includes(solveMark)
      ? <Icon size={0.9} path={SolveMarkIconMap[solveMark].icon} />
      : solveMark

  return (
    <Card
      onClick={onClick}
      radius="md"
      shadow="sm"
      className={cx(hoverClasses.root, classes.root)}
      data-solved={darkenCard}
    >
      <Stack gap="xs" pos="relative" style={{ zIndex: 99 }}>
        <Group h="30px" wrap="nowrap" justify="space-between" gap={2}>
          <Text fw="bold" truncate fz="lg">
            {hideWeekInTitle ? challenge.title?.replace(/\[week\d\]\s*/i, "") : challenge.title}
          </Text>
        </Group>
        <Divider size="sm" color={cateData?.color} />
        <Group wrap="nowrap" justify="space-between" align="center" gap={2}>
          <Text ta="center" fw="bold" fz="lg" ff="monospace">
            {challenge.score}&nbsp;pts
          </Text>
          <Stack gap="xs">
            <Title order={6} c="dimmed" ta="center" mt={`calc(${theme.spacing.xs} / 2)`}>
              <Trans
                i18nKey={'challenge.content.solved'}
                values={{
                  solved: challenge.solved,
                }}
              >
                _
                <Code fz="sm" fw="bold" bg="transparent">
                  _
                </Code>
                _
              </Trans>
            </Title>
            <Group justify="center" gap="md" h={20} wrap="nowrap">
              {challenge.bloods &&
                challenge.bloods.map((blood, idx) => {
                  const iconProps = iconMap.get(BloodsTypes[idx])!
                  return (
                    <Tooltip.Floating
                      key={idx}
                      position="bottom"
                      multiline
                      classNames={tooltipClasses}
                      label={
                        <Stack gap={0}>
                          <Text fw={500} size="sm">
                            {blood?.name}
                          </Text>
                          <Text fw={500} size="xs" c="dimmed">
                            {dayjs(blood?.submitTimeUtc).format('YY/MM/DD HH:mm:ss')}
                          </Text>
                        </Stack>
                      }
                    >
                      <div style={{ position: 'relative', height: 20 }}>
                        <div style={{ position: 'relative', zIndex: 92 }}>
                          <Icon {...iconProps} />
                        </div>
                        <Box
                          className={classes.spike}
                          data-blood={teamId === blood?.id || undefined}
                          __vars={{
                            '--blood-color': colorMap.get(BloodsTypes[idx]),
                          }}
                        />
                      </div>
                    </Tooltip.Floating>
                  )
                })}
            </Group>
          </Stack>
        </Group>
      </Stack>
      {cateData && (
        <Icon
          size={4}
          path={cateData.icon}
          color={alpha(theme.colors[cateData?.color][7], 0.3)}
          className={classes.icon}
        />
      )}
      {showMark && (
        <Center className={classes.flag}>
          {markIcon}
        </Center>
      )}
    </Card>
  )
}

export default ChallengeCard
