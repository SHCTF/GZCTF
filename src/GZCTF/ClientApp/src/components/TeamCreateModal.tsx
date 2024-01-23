import {
  Button,
  Center,
  Modal,
  ModalProps,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { mdiCheck, mdiCloseCircle } from '@mdi/js'
import { Icon } from '@mdi/react'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { showErrorNotification } from '@Utils/ApiErrorHandler'
import api, { TeamUpdateModel } from '@Api'

interface TeamEditModalProps extends ModalProps {
  isOwnTeam: boolean
  mutate: () => void
}

const TeamCreateModal: FC<TeamEditModalProps> = (props) => {
  const { isOwnTeam, mutate, ...modalProps } = props
  const [createTeam, setCreateTeam] = useState<TeamUpdateModel>({ name: '', bio: '' })
  const [disabled, setDisabled] = useState(false)
  const theme = useMantineTheme()

  const { t } = useTranslation()

  const onCreateTeam = () => {
    setDisabled(true)

    api.team
      .teamCreateTeam(createTeam)
      .then((res) => {
        showNotification({
          color: 'teal',
          title: '队伍已创建',
          message: `${res.data.name} 创建成功，快去邀请队友吧！`,
          icon: <Icon path={mdiCheck} size={1} />,
        })
        mutate()
      })
      .catch((e) => showErrorNotification(e, t))
      .finally(() => {
        setDisabled(false)
        modalProps.onClose()
      })
  }

  return (
    <Modal {...modalProps}>
      {isOwnTeam ? (
        <Stack spacing="lg" p={40} ta="center">
          <Center>
            <Icon color={theme.colors.red[7]} path={mdiCloseCircle} size={4} />
          </Center>
          <Title order={3}>你已经创建了一个队伍</Title>
          <Text>
            每个人只能拥有一个队伍
            <br />
            你可以删除队伍后重新创建
          </Text>
        </Stack>
      ) : (
        <Stack>
          <Text>
            创建一个队伍，你可以组织一个队伍，并且可以邀请其他人加入。每个人只能拥有一个队伍。
          </Text>
          <TextInput
            label="队伍名称"
            type="text"
            placeholder="team"
            w="100%"
            disabled={disabled}
            value={createTeam?.name ?? ''}
            onChange={(event) => setCreateTeam({ ...createTeam, name: event.currentTarget.value })}
          />
          <Textarea
            label="队伍签名"
            placeholder={createTeam?.bio ?? '这个人很懒，什么都没有写'}
            value={createTeam?.bio ?? ''}
            w="100%"
            autosize
            minRows={2}
            maxRows={4}
            disabled={disabled}
            onChange={(event) => setCreateTeam({ ...createTeam, bio: event.currentTarget.value })}
          />
          <Button fullWidth variant="outline" onClick={onCreateTeam} disabled={disabled}>
            创建队伍
          </Button>
        </Stack>
      )}
    </Modal>
  )
}

export default TeamCreateModal
