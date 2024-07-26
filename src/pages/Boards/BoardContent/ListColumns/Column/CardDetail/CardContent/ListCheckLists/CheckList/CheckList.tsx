import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { ICheckList } from '~/apis/type'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { HTMLAttributes, useEffect, useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import { useSortable } from '@dnd-kit/sortable'
import ListItem from './ListItem/ListItem'
import { mapOrder } from '~/utils/sort'
import { RootState, useAppDispatch } from '~/redux/store'
import {
  createNewCheckItem,
  deleteCheckListAPI,
  updateCheckList,
  updateCheckListState
} from '~/redux/cardSlice'
import CloseIcon from '@mui/icons-material/Close'
import { deleteStatus, openAddCheckItem, updateStatus } from '~/redux/checkListSlice'
import { useSelector } from 'react-redux'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
  }
}))

type CheckListProps = {
  checkList: ICheckList
} & HTMLAttributes<HTMLDivElement>

function CheckList({ checkList, ...props }: CheckListProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: checkList._id,
    data: { ...checkList }
  })

  const dndKitCheckListStyles: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: transition || undefined,
    height: '100%',
    opacity: isDragging ? 0.5 : 1
  }

  const dispatch = useAppDispatch()
  const [openAddForm, setOpenAddForm] = useState<boolean>(false)
  const [deleteCheckList, setDeleteCheckList] = useState<boolean>(false)
  const [update, setUpdate] = useState<boolean>(false)
  const checkListState = useSelector((state: RootState) => state.checkList)
  const [editedTitle, setEditedTitle] = useState<string | undefined>(checkList.title)

  const openDelete = () => {
    dispatch(deleteStatus({ checkListId: checkList._id }))
  }
  const finishDelete = () => {
    dispatch(deleteCheckListAPI(checkList._id))
  }
  const openAddCI = () => {
    dispatch(openAddCheckItem({ checkListId: checkList._id }))
  }
  const [title, setTitle] = useState<string | undefined>('')
  const createCheckItem = () => {
    dispatch(createNewCheckItem({ checkListId: checkList._id, title: title, boardId: checkList.boardId }))
    dispatch(openAddCheckItem({ checkListId: checkList._id }))
  }
  useEffect(() => {
    if (checkList._id === checkListState.checkListIdDelete) {
      setDeleteCheckList(checkListState.openDelete)
    } else setDeleteCheckList(false)
    if (checkList._id === checkListState.checkListIdAdd) {
      setOpenAddForm(checkListState.openAddCheckItem)
    } else setOpenAddForm(false)
    if (checkList._id === checkListState.checkListIdUpate) {
      setUpdate(checkListState.openEdit)
    } else {
      setUpdate(false)
      setEditedTitle(checkList.title)
    }
  }, [checkListState, checkList._id, checkList.title])

  const handleClick = () => {
    dispatch(updateStatus({ checkListId: checkList._id }))
  }
  const handleEditTitle = () => {
    dispatch(updateCheckList({ checkListId: checkList._id, dataUpdate: { title: editedTitle } }))
    dispatch(updateCheckListState({ checkListId: checkList._id, title: editedTitle }))
    dispatch(updateStatus({ checkListId: checkList._id }))
  }

  const [progress, setProgress] = useState<number>(
    checkList.checkItems.filter((item) => item.state !== 'incomplete').length
  )
  useEffect(() => {
    setProgress(checkList.checkItems.filter((item) => item.state !== 'incomplete').length)
  }, [checkList])
  const orderedCheckItem = mapOrder(checkList?.checkItems, checkList.listItemOrderIds, '_id')
  const numOfItem = checkList.checkItems.length
  const calcPercent = () => (numOfItem !== 0 ? Math.floor((progress / numOfItem) * 100) : 0)
  return (
    <div ref={setNodeRef} style={dndKitCheckListStyles} {...props} {...attributes}>
      <Box sx={{ cursor: 'pointer', position: 'relative' }} {...listeners}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1, mt: 2 }}>
          <CheckBoxOutlinedIcon sx={{ p: 0.5, fontSize: 30 }} />
          {update ? (
            <Box sx={{ width: '100%', ml: 1.1, borderWidth: '2px' }} data-no-dnd="true">
              <TextField
                id="outlined-search"
                type="text"
                size="medium"
                variant="outlined"
                placeholder="Thêm một mục"
                value={editedTitle}
                autoFocus
                sx={{
                  alignContent: 'flex-start',
                  width: '94%',
                  '&.MuiOutlinedInput-root': {
                    '& fieldset': { borderWidth: '2px !important', borderColor: '#1565c0' },
                    '&:hover fieldset': { borderWidth: '2px !important', borderColor: '#1565c0' },
                    '&.Mui-focused fieldset': {
                      borderWidth: '2px !important',
                      borderColor: '#1565c0'
                    }
                  },
                  bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2b2e36')
                }}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <Button
                variant="contained"
                size="small"
                sx={{
                  width: '10%',
                  height: '35px'
                }}
                onClick={handleEditTitle}
              >
                Lưu
              </Button>
              <IconButton
                aria-label="close"
                onClick={handleClick}
                sx={{
                  color: (theme) => theme.palette.grey[500]
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', width: '100%' }}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 0, fontWeight: 'bold', width: '84%' }}
                onClick={handleClick}
              >
                {checkList.title}
              </Typography>
              <Typography
                variant="subtitle1"
                onClick={openDelete}
                sx={{
                  borderRadius: 1,
                  p: '1px 10px',
                  fontSize: 14,
                  bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2b2e36'),
                  '&:hover': {
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0')
                  }
                }}
              >
                Xóa
              </Typography>
            </Box>
          )}

          {deleteCheckList && (
            // <Popper id={checkList._id} open={deleteCheckList}>
            // </Popper>
            <Box
              onClick={(e) => e.stopPropagation()}
              data-no-dnd="true"
              sx={{
                position: 'absolute',
                top: '30%',
                left: '40%',
                transform: 'translateX(55%)',
                zIndex: 1500,
                minWidth: '300px',
                maxWidth: '300px',
                minHeight: '150px',
                maxHeight: '150px',
                padding: '4px 8px',
                borderRadius: 1,
                bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2b2e36'),
                boxShadow: 24,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignContent: 'center',
                  justifyContent: 'space-around'
                }}
              >
                <Box sx={{ width: '10%' }}></Box>
                <Typography sx={{ pt: 1, fontWeight: 'bold', textAlign: 'center' }}>
                  Bạn muốn xoá {checkList.title}?
                </Typography>
                <Box sx={{ width: '10%' }}>
                  <IconButton
                    aria-label="close"
                    onClick={openDelete}
                    sx={{
                      color: (theme) => theme.palette.grey[500]
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography sx={{ pl: 1.2 }} variant="body1">
                Danh sách công việc sẽ bị xoá vĩnh viễn và không bao giờ lấy lại được.
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: '#c0392b',
                  width: '95%',
                  height: '35px',
                  m: 1,
                  '&:hover': { bgcolor: '#e74c3c' }
                }}
                onClick={finishDelete}
              >
                Xóa danh sách công việc
              </Button>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            p: 0.5,
            width: '95%',
            borderRadius: 1,
            cursor: 'pointer'
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography sx={{ width: '5%' }}>{calcPercent()}%</Typography>
            <BorderLinearProgress
              variant="determinate"
              value={calcPercent()}
              sx={{ width: '95%', mt: 0.5 }}
            />
          </Box>
          {numOfItem !== 0 && (
            <ListItem checkItems={orderedCheckItem} progress={progress} setProgress={setProgress} />
          )}
          <Box sx={{ display: 'flex', gap: 1, mt: -1 }}>
            <Box sx={{ width: '6%' }}></Box>
            {!openAddForm && (
              <Button variant="contained" sx={{ mb: 0, fontWeight: 'bold' }} onClick={openAddCI}>
                Thêm một mục
              </Button>
            )}
            {openAddForm && (
              <Box sx={{ width: '100%' }}>
                <TextField
                  id="outlined-search"
                  type="text"
                  size="medium"
                  variant="outlined"
                  data-no-dnd="true"
                  placeholder="Thêm một mục"
                  autoFocus
                  sx={{
                    alignContent: 'flex-start',
                    width: '100%',
                    '&.MuiOutlinedInput-root': {
                      '& fieldset': { borderWidth: '2px !important', borderColor: '#1565c0' },
                      '&:hover fieldset': { borderWidth: '2px !important', borderColor: '#1565c0' },
                      '&.Mui-focused fieldset': {
                        borderWidth: '2px !important',
                        borderColor: '#1565c0'
                      }
                    },
                    bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2b2e36')
                  }}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Button
                  variant="contained"
                  data-no-dnd="true"
                  size="small"
                  sx={{
                    width: '40%',
                    height: '35px'
                  }}
                  onClick={createCheckItem}
                >
                  Thêm
                </Button>
                <Button
                  variant="contained"
                  data-no-dnd="true"
                  size="small"
                  sx={{
                    boxShadow: 'none',
                    width: '40%',
                    height: '35px',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white'),
                    color: (theme) => (theme.palette.mode === 'light' ? 'black' : ''),
                    '&:hover': {
                      boxShadow: 'none',
                      backgroundColor: (theme) =>
                        theme.palette.mode === 'light' ? '#e3e9e6' : '#2b2e36'
                    },
                    m: 1
                  }}
                  onClick={openAddCI}
                >
                  Huỷ
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default CheckList
