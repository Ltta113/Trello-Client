import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useEffect, useState } from 'react'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { ILabel } from '~/apis/type'
import { getColorByName } from '~/assets/labels'
import { RootState, useAppDispatch } from '~/redux/store'
import { useSelector } from 'react-redux'
import { addLabelAPI, updatelabel, updateLabelAPI } from '~/redux/labelSlice'
import { updateBoardState } from '~/redux/boardSlice'

type LabelsProps = {
  label: ILabel
}

function Labels({ label }: LabelsProps) {
  const dispatch = useAppDispatch()
  const cardId = useSelector((state: RootState) => state.card.cardId)
  const labels = useSelector((state: RootState) => state.label.labels)
  const [checked, setChecked] = useState<boolean>(false)

  const color = getColorByName(label.color)

  useEffect(() => {
    if (label.listCard.includes(cardId)) {
      setChecked(true)}
  }, [cardId, label.listCard, labels])

  const handleToggle = () => {
    if (!checked) {
      dispatch(addLabelAPI({ labelId: label._id, cardId: cardId }))
      dispatch(updateBoardState({ label: label, cardIdAdd: cardId }))
    } else {
      const updatedListCard = label.listCard.filter((card) => card !== cardId)
      dispatch(updateLabelAPI({ labelId: label?._id, dataUpdate: { listCard: updatedListCard } }))
      dispatch(updateBoardState({ label: label, cardIdRemove: cardId }))
    }
    setChecked(!checked)
  }
  const handleEdit = () => {
    dispatch(updatelabel({ label: label }))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <ListItem
        key={label._id}
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, padding: 0, pr: 1 }}
      >
        <Checkbox
          edge="start"
          onClick={handleToggle}
          size="medium"
          checked={checked}
          tabIndex={-1}
          disableRipple
          inputProps={{ 'aria-labelledby': label._id }}
          sx={{ width: '10%', pl: 3 }}
        />
        <ListItemButton
          role={undefined}
          onClick={handleToggle}
          dense
          sx={{
            width: '10%',
            bgcolor: `${color}`,
            borderRadius: 1,
            height: '37px'
          }}
        >
          <ListItemText id={label._id} primary={label.title} />
        </ListItemButton>
        <Box
          sx={{
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '37px',
            width: '30px',
            mb: 1,
            cursor: 'pointer',
            bgcolor: (theme) => (theme.palette.mode === 'light' ? 'white' : '#2b2e36'),
            '&:hover': {
              bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2b2e36')
            }
          }}
          onClick={handleEdit}
        >
          <CreateOutlinedIcon fontSize="small" />
        </Box>
      </ListItem>
    </Box>
  )
}

export default Labels
