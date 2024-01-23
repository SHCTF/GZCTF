import { Stack, Text, Title } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import IconWiderScreenRequired from '@Components/icon/WiderScreenRequiredIcon'

interface WithWiderScreenProps extends React.PropsWithChildren {
  minWidth?: number
}

const WithWiderScreen: FC<WithWiderScreenProps> = ({ children, minWidth = 1080 }) => {
  const view = useViewportSize()

  const { t } = useTranslation()

  const tooSmall = minWidth > 0 && view.width > 0 && view.width < minWidth

  return tooSmall ? (
    <Stack spacing={0} align="center" justify="center" h="calc(100vh - 32px)">
      <IconWiderScreenRequired />
      <Title order={1} color="#00bfa5" fw="lighter">
        页面宽度不足
      </Title>
      <Text fw="bold">请使用更宽的设备浏览本页面</Text>
    </Stack>
  ) : (
    <>{children}</>
  )
}

export default WithWiderScreen
