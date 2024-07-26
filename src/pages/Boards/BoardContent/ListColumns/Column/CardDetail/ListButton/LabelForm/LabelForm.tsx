import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Labels from './Labels/Labels'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import { getColorByName, getItems, LabelItem, labelsColor, noneColor } from '~/assets/labels'
import { useEffect, useState } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Grid from '@mui/material/Grid'
import { experimentalStyled as styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import { Divider } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '~/redux/store'
import {
  createNewLabelAPI,
  deleteLabelAPI,
  fetchLabelDetails,
  resetUpdateLabel,
  updateLabelAPI
} from '~/redux/labelSlice'
import { updateLabelState } from '~/redux/cardSlice'
import { updateBoardState } from '~/redux/boardSlice'

type LabelFormProps = {
  createLabel: boolean
  // eslint-disable-next-line no-unused-vars
  setCreateLabel: (value: React.SetStateAction<boolean>) => void
}

const Item = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'selected'
})<{
  bgColor: string
  selected: boolean
}>(({ theme, bgColor, selected }) => ({
  backgroundColor: bgColor,
  boxShadow: selected ? `0 0 0 2px ${theme.palette.primary.main}` : 'none',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  transition: 'border 0.3s ease',
  cursor: 'pointer'
}))

function LabelForm({ createLabel, setCreateLabel }: LabelFormProps) {
  const dispatch = useAppDispatch()
  const board = useSelector((state: RootState) => state.board.board)
  const labels = useSelector((state: RootState) => state.label.labels)
  const label = useSelector((state: RootState) => state.label.label)
  const cardId = useSelector((state: RootState) => state.card.cardId)
  const openEdit = useSelector((state: RootState) => state.label.openEdit)
  const [open, setOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [color, setColor] = useState<LabelItem>(labelsColor[1].items[7])

  const items = getItems(labelsColor)
  useEffect(() => {
    if (board?._id) {
      dispatch(fetchLabelDetails(board._id))
    }
  }, [board?._id, dispatch])
  useEffect(() => {
    if (openEdit) {
      const newColor: LabelItem = {
        name: label?.color || labelsColor[1].items[7].name,
        color: getColorByName(label?.color || '')
      }
      setColor(newColor)
      setTitle(label?.title || '')
      setOpen(true)
    }
  }, [dispatch, label?.color, label?.title, openEdit])

  useEffect(() => {
    const updatelabels = labels.filter((label) => label.listCard.includes(cardId))
    dispatch(updateLabelState(updatelabels))
  }, [cardId, dispatch, labels])

  const handleCreateLabel = async () => {
    if (!openEdit) {
      const dataUpdate = {
        title: title,
        color: color.name,
        boardId: board?._id
      }
      const newLabel = await dispatch(createNewLabelAPI({ dataUpdate: dataUpdate })).unwrap()
      dispatch(updateBoardState({ addLabel: newLabel }))
      handleOpen()
    } else {
      dispatch(
        updateLabelAPI({ labelId: label?._id, dataUpdate: { title: title, color: color.name } })
      )
      dispatch(updateBoardState({ label: label, title: title, color: color.name }))
      handleOpen()
    }
  }
  const handleDeleteLabel = () => {
    dispatch(deleteLabelAPI({ labelId: label?._id }))
    dispatch(updateBoardState({ label: label, deleteId: label?._id }))
    handleOpen()
  }
  const handleOpen = () => {
    setOpen(!open)
    setColor(labelsColor[1].items[7])
    setTitle('')
    dispatch(resetUpdateLabel())
  }

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={{
        position: 'fixed',
        top: '10%',
        left: '61%',
        zIndex: 1500,
        minWidth: '300px',
        maxWidth: '300px',
        minHeight: '150px',
        maxHeight: 'auto',
        padding: '4px 8px',
        borderRadius: 1,
        bgcolor: (theme) => (theme.palette.mode === 'light' ? 'white' : '#2b2e36'),
        boxShadow: 24,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {!open && (
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ width: '10%' }}></Box>
            <Typography sx={{ pt: 1 }}>Nhãn</Typography>
            <Box sx={{ mr: 1 }}>
              <IconButton
                aria-label="close"
                onClick={() => setCreateLabel(!createLabel)}
                sx={{
                  color: (theme) => theme.palette.grey[500]
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Box>
            <TextField
              id="outlined-search"
              type="text"
              size="small"
              variant="outlined"
              data-no-dnd="true"
              placeholder="Tìm nhãn..."
              autoFocus
              sx={{
                p: 1,
                width: '100%'
              }}
              //   onChange={(e) => setTitleCL(e.target.value)}
            />
            <Box sx={{ fontSize: 11, alignItems: 'start', pl: 1, fontWeight: 'bold' }}>Nhãn</Box>
            <Box sx={{ pl: 0.5 }}>
              {labels.map((label, index) => (
                <Labels key={index} label={label}></Labels>
              ))}
            </Box>
            <Button
              variant="contained"
              data-no-dnd="true"
              size="small"
              sx={{
                width: '95%',
                height: '35px',
                m: 1,
                color: (theme) => (theme.palette.mode === 'light' ? 'black' : 'white'),
                bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2b2e36'),
                '&:hover': {
                  bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2b2e36')
                }
              }}
              onClick={() => setOpen(!open)}
            >
              Tạo nhãn mới
            </Button>
          </Box>
        </Box>
      )}
      {open && (
        <Box>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignContent: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ ml: 1 }}>
              <IconButton
                aria-label="close"
                onClick={handleOpen}
                sx={{
                  color: (theme) => theme.palette.grey[500]
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
            </Box>
            <Typography sx={{ pt: 1 }}>Tạo nhãn mới</Typography>
            <Box sx={{ mr: 1 }}>
              <IconButton
                aria-label="close"
                onClick={() => setCreateLabel(!createLabel)}
                sx={{
                  color: (theme) => theme.palette.grey[500]
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ width: '100%', height: '100px', p: '33px' }}>
            <Tooltip title={`Color: ${color.name}, title: ${title || 'none'}`}>
              <Box
                sx={{
                  bgcolor: `${color.color}`,
                  borderRadius: 1,
                  height: '100%',
                  p: 0.5,
                  pl: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {title}
              </Box>
            </Tooltip>
          </Box>
          <Box sx={{ fontSize: 11, alignItems: 'start', pl: 1, fontWeight: 'bold' }}>Tiêu đề</Box>
          <Box>
            <TextField
              id="outlined-search"
              type="text"
              size="small"
              variant="outlined"
              data-no-dnd="true"
              value={title}
              autoFocus
              sx={{
                p: 1,
                width: '100%'
              }}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Box sx={{ fontSize: 11, alignItems: 'start', pl: 1, fontWeight: 'bold', pb: 1 }}>
              Chọn một màu
            </Box>
            <Box sx={{ pl: 1, pr: 1 }}>
              <Grid container spacing={{ xs: 2, md: 1 }} columns={10}>
                {items.map((item, index) => (
                  <Grid item xs={2} sm={2} md={2} key={index}>
                    <Tooltip title={item.name.replace('_', ' ')} sx={{ cursor: 'pointer' }}>
                      <Item
                        bgColor={item.color}
                        selected={item.color === color.color}
                        onClick={() => setColor(item)}
                      ></Item>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Button
              disabled={color === noneColor}
              variant="contained"
              data-no-dnd="true"
              size="small"
              sx={{
                width: '95%',
                height: '35px',
                m: 1,
                color: (theme) => (theme.palette.mode === 'light' ? 'black' : 'white'),
                bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2b2e36'),
                '&:hover': {
                  bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2b2e36')
                }
              }}
              onClick={() => setColor(noneColor)}
            >
              <CloseIcon />
              Gỡ màu
            </Button>
            <Divider></Divider>
            {!openEdit && (
              <Button sx={{ m: 1 }} onClick={handleCreateLabel} variant="contained">
                Tạo mới
              </Button>
            )}
            {openEdit && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button sx={{ m: 1 }} onClick={handleCreateLabel} variant="contained">
                  Lưu
                </Button>
                <Button sx={{ m: 1 }} onClick={handleDeleteLabel} variant="contained" color="error">
                  Xóa
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default LabelForm
