import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Grid from '@mui/material/Grid'
import { getNormalLabels } from '~/assets/labels'
import { experimentalStyled as styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Paper from '@mui/material/Paper'
import { useEffect, useState } from 'react'
import { unsplashApi } from '~/apis/unsplash/unsplashApi'
import { Photo } from '~/apis/unsplash/type'
import { toast } from 'react-toastify'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import TextField from '@mui/material/TextField'
import ShowSize from './ShowSize/ShowSize'
import { updateCardDetails, updateCardState } from '~/redux/boardSlice'
import { RootState, useAppDispatch } from '~/redux/store'
import { useSelector } from 'react-redux'
import { createNewAttachment, updateCoverState } from '~/redux/cardSlice'
import { IAttachment } from '~/apis/type'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

type CoverFormProps = {
  coverOpen: boolean
  // eslint-disable-next-line no-unused-vars
  setCoverOpen: (value: React.SetStateAction<boolean>) => void
}
const HoverImageListItemBar = styled(ImageListItemBar)(() => ({
  background: 'rgba(0, 0, 0, 0.5)',
  opacity: 0,
  transition: 'opacity 0.3s',
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: '40%',
  '&:hover': {
    opacity: 1
  },
  '& .MuiImageListItemBar-title': {
    textDecoration: 'underline',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '0.75rem',
    textAlign: 'left'
  }
}))

const Item = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'selected'
})<{
  bgColor: string
  selected: boolean
}>(({ theme, bgColor, selected }) => ({
  backgroundColor: bgColor,
  boxShadow: selected && bgColor !== '' ? `0 0 0 2px ${theme.palette.primary.main}` : 'none',
  border: selected && bgColor === '' ? `2px solid ${theme.palette.primary.main}` : 'none',
  borderRadius: selected && bgColor === '' ? '5px' : 'none',
  ...theme.typography.body2,
  padding: bgColor !== '' ? theme.spacing(2) : 1,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  transition: 'border 0.3s ease',
  cursor: 'pointer'
}))

function Cover({ coverOpen, setCoverOpen }: CoverFormProps) {
  const colorCover = getNormalLabels()
  const [color, setColor] = useState<string>('')
  const [attachmentId, setAttachmentId] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<'full' | 'half' | null>(null)
  const [searchTxt, setSearchTxt] = useState<string>('')
  const [openSearch, setOpenSearch] = useState<boolean>(false)
  const [photos, setPhotos] = useState<Photo[] | []>([])
  const [photosResponse, setPhotosResponse] = useState<Photo[]>()
  const [attachmentPhoto, setAttachmentPhoto] = useState<IAttachment[]>()
  const [page, setPage] = useState<number>(1) // Trang hiện tại
  const [hasMore, setHasMore] = useState<boolean>(true)
  const card = useSelector((state: RootState) => state.card.card)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (card?.cover) {
      if (card.cover.color) setColor(card.cover.color)
      if (card?.cover?.size) setSelectedSize(card.cover.size)
      if (card?.cover?.idAttachment) setAttachmentId(card.cover.idAttachment)
    }
    if (card?.attachments) {
      const attachmentImages = card.attachments.filter((attachment) =>
        attachment.mimeType.startsWith('image/')
      )
      setAttachmentPhoto(attachmentImages)
    }
  }, [card?.attachments, card?.cover])

  useEffect(() => {
    unsplashApi.search
      .getPhotos({ query: 'natural', page: 1, perPage: 12, orientation: 'landscape' })
      .then((result) => {
        const photos = result.response?.results as never as Photo[]
        setPhotosResponse(photos)
      })
      .catch(() => {
        toast.error('Something went wrong!')
      })
  }, [])

  const handleInputChange = async (text: string) => {
    try {
      const result = await unsplashApi.search.getPhotos({
        query: text || 'natural',
        orientation: 'landscape',
        page: page,
        perPage: 30
      })
      const totalPage = result.response?.total_pages as number
      const image = result.response?.results as never as Photo[]
      setPhotos((prev) => [...prev, ...image])
      setHasMore(page < totalPage)
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    if (scrollHeight - scrollTop < clientHeight + 1 && hasMore) {
      setPage((prev) => prev + 1)
      handleInputChange(searchTxt)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && card) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('cardId', card._id)
      try {
        const newAttachment = await dispatch(createNewAttachment(formData)).unwrap()
        dispatch(
          updateCardState({
            cardId: card._id,
            columnId: card.columnId,
            attachment: newAttachment
          })
        )
      } catch (error) {
        toast.error(`Error: ${error}`)
      }
    }
  }

  const handleSetColor = (color: string) => {
    setColor(color)
    setAttachmentId('')
    if (card?._id) {
      const updatedCover = {
        ...card.cover,
        idAttachment: null,
        color: color === '' ? null : color,
        idCloudImage: null
      }
      dispatch(updateCardDetails({ cardId: card._id, dataUpdate: { cover: updatedCover } }))
      dispatch(
        updateCardState({
          cardId: card._id,
          columnId: card.columnId,
          dataUpdate: { cover: updatedCover }
        })
      )
      dispatch(updateCoverState({ cover: updatedCover }))
    }
  }
  const handleSetAttachmentId = (attachmentId: string) => {
    setColor('')
    setAttachmentId(attachmentId)
    if (card?._id) {
      const updatedCover = {
        ...card.cover,
        idAttachment: attachmentId,
        color: null,
        idCloudImage: null
      }
      dispatch(updateCardDetails({ cardId: card._id, dataUpdate: { cover: updatedCover } }))
      dispatch(
        updateCardState({
          cardId: card._id,
          columnId: card.columnId,
          dataUpdate: { cover: updatedCover }
        })
      )
      dispatch(updateCoverState({ cover: updatedCover }))
    }
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
        minHeight: '200px',
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
      {!openSearch && (
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ width: '10%' }}></Box>
            <Typography sx={{ pt: 1 }}>Ảnh bìa</Typography>
            <Box sx={{ mr: 1 }}>
              <IconButton
                aria-label="close"
                onClick={() => setCoverOpen(!coverOpen)}
                sx={{
                  color: (theme) => theme.palette.grey[500]
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Box>
            <Box sx={{ fontSize: 11, alignItems: 'start', pl: 1, fontWeight: 'bold' }}>
              Kích thước
            </Box>
            <ShowSize
              colorName={color}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
            />
            {(color || attachmentId) && (
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
                onClick={() => handleSetColor('')}
              >
                Xóa ảnh bìa
              </Button>
            )}
          </Box>
          <Box sx={{ m: '4px 0px 6px 0px' }}>
            <Box sx={{ fontSize: 11, alignItems: 'start', pl: 1, fontWeight: 'bold' }}>Màu sắc</Box>
            <Box sx={{ pl: 1, pr: 1 }}>
              <Grid container spacing={{ xs: 2, md: 1 }} columns={10}>
                {colorCover.map((item, index) => (
                  <Grid item xs={2} sm={2} md={2} key={index}>
                    <Tooltip title={item.name.replace('_', ' ')} sx={{ cursor: 'pointer' }}>
                      <Item
                        bgColor={item.color}
                        selected={item.name === color}
                        onClick={() => handleSetColor(item.name)}
                      ></Item>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
          <Box>
            <Box sx={{ fontSize: 11, alignItems: 'start', pl: 1, fontWeight: 'bold' }}>
              Các tệp đính kèm
            </Box>
            {attachmentPhoto && (
              <ImageList
                sx={{ pl: 1, pr: 1, maxHeight: '120px', height: 'auto' }}
                cols={3}
                // rowHeight={48}
              >
                {attachmentPhoto.map((item, index) => (
                  <ImageListItem key={index} sx={{ overflow: 'hidden' }}>
                    <Item
                      bgColor={''}
                      selected={item._id === attachmentId}
                      onClick={() => handleSetAttachmentId(item._id)}
                    >
                      <img
                        srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                        src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                        alt={item.name}
                        loading="lazy"
                        style={{
                          borderRadius: '4px',
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%',
                          cursor: 'pointer'
                        }}
                      />
                    </Item>
                  </ImageListItem>
                ))}
              </ImageList>
            )}
            <Button
              variant="contained"
              data-no-dnd="true"
              size="small"
              component="label"
              role={undefined}
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
            >
              Tải tệp lên
              <VisuallyHiddenInput accept="image/*" type="file" onChange={handleFileUpload} />
            </Button>
          </Box>
          <Box sx={{ m: '4px 0px 6px 0px' }}>
            <Box sx={{ fontSize: 11, alignItems: 'start', pl: 1, fontWeight: 'bold', pb: 1 }}>
              Ảnh từ Unsplash
            </Box>
            {photosResponse && (
              <ImageList sx={{ pl: 1, pr: 1, height: '120px' }} cols={3} rowHeight={48}>
                {photosResponse.slice(0, 6).map((item, index) => (
                  <ImageListItem key={index} sx={{ overflow: 'hidden' }}>
                    <img
                      srcSet={`${item.urls.regular}?w=164&h=164&fit=crop&auto=format`}
                      src={`${item.urls.regular}?w=164&h=164&fit=crop&auto=format`}
                      alt={item.user.username}
                      loading="lazy"
                      style={{
                        borderRadius: '4px',
                        objectFit: 'cover', // Đảm bảo ảnh không bị biến dạng
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer'
                      }}
                    />
                    <HoverImageListItemBar
                      title={item.user.username}
                      position="bottom"
                      sx={{
                        '.MuiImageListItemBar-titleWrap': {
                          cursor: 'pointer',
                          alignItems: 'center'
                        }
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
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
              onClick={() => setOpenSearch(!openSearch)}
            >
              Tìm kiếm ảnh
            </Button>
          </Box>
        </Box>
      )}
      {openSearch && (
        <Box sx={{ overflow: 'auto' }}>
          <Box
            sx={{
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ ml: 1 }}>
              <IconButton
                aria-label="close"
                onClick={() => {
                  setOpenSearch(!openSearch)
                  setPhotos([])
                  setPage(1)
                  setSearchTxt('')
                }}
                sx={{
                  color: (theme) => theme.palette.grey[500]
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
            </Box>
            <Typography sx={{ pt: 1 }}>Tìm kiếm ảnh</Typography>
            <Box sx={{ mr: 1 }}>
              <IconButton
                aria-label="close"
                onClick={() => {
                  setCoverOpen(!coverOpen)
                  setSearchTxt('')
                }}
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
              autoFocus
              sx={{
                p: 1,
                width: '100%'
              }}
              onChange={(e) => {
                handleInputChange(e.target.value)
                setPhotos([])
                setPage(1)
                setSearchTxt(e.target.value)
              }}
            />
          </Box>
          <Box sx={{ fontSize: 11, alignItems: 'start', pl: 1, fontWeight: 'bold', pb: 1 }}>
            Các tìm kiếm gợi ý
          </Box>
          <Box sx={{ fontSize: 11, alignItems: 'start', pl: 1, fontWeight: 'bold', pb: 1 }}>
            Ảnh hàng đầu
          </Box>
          <Box sx={{ height: 'auto' }}></Box>
          <Box sx={{ height: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
            {photosResponse && photos.length === 0 && (
              <ImageList sx={{ pl: 1, pr: 1, height: '240px' }} cols={3} rowHeight={48}>
                {photosResponse.map((item) => (
                  <ImageListItem key={item.id} sx={{ overflow: 'hidden' }}>
                    <img
                      srcSet={`${item.urls.regular}?w=164&h=164&fit=crop&auto=format`}
                      src={`${item.urls.regular}?w=164&h=164&fit=crop&auto=format`}
                      alt={item.user.username}
                      loading="lazy"
                      style={{
                        borderRadius: '4px',
                        objectFit: 'cover', // Đảm bảo ảnh không bị biến dạng
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer'
                      }}
                    />
                    <HoverImageListItemBar
                      title={item.user.username}
                      position="bottom"
                      sx={{
                        '.MuiImageListItemBar-titleWrap': {
                          cursor: 'pointer',
                          alignItems: 'center'
                        }
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
            {photos && (
              <Box>
                <ImageList
                  component="div"
                  sx={{
                    pl: 1,
                    pr: 1,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: '#bfc2cf'
                    },
                    '&::-webkit-scrollbar': { width: '7px' }
                  }}
                  cols={2}
                  rowHeight={81}
                  onScroll={handleScroll}
                >
                  {photos.map((item, index) => (
                    <ImageListItem key={index}>
                      <img
                        srcSet={`${item.urls.regular}?w=164&h=164&fit=crop&auto=format`}
                        src={`${item.urls.regular}?w=164&h=164&fit=crop&auto=format`}
                        alt={item.user.username}
                        loading="lazy"
                        style={{
                          borderRadius: '4px',
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%',
                          cursor: 'pointer'
                        }}
                      />
                      <HoverImageListItemBar
                        title={item.user.username}
                        position="bottom"
                        sx={{
                          '.MuiImageListItemBar-titleWrap': {
                            cursor: 'pointer',
                            alignItems: 'center'
                          }
                        }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Cover
