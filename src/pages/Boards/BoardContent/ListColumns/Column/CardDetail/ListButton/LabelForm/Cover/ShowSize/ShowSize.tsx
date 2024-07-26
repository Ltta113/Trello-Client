import Box from '@mui/material/Box'
import { useSelector } from 'react-redux'
import { getColorByName } from '~/assets/labels'
import { updateCardDetails, updateCardState } from '~/redux/boardSlice'
import { updateCoverState } from '~/redux/cardSlice'
import { RootState, useAppDispatch } from '~/redux/store'

type Props = {
  colorName: string
  selectedSize: 'full' | 'half' | null
  // eslint-disable-next-line no-unused-vars
  setSelectedSize: (size: 'full' | 'half' | null) => void
}

function ShowSize({ colorName, selectedSize, setSelectedSize }: Props) {
  const card = useSelector((state: RootState) => state.card.card)

  const dispatch = useAppDispatch()
  const color = getColorByName(colorName)

  const handleOnClick = (size: 'full' | 'half') => {
    setSelectedSize(size)
    if (card?._id) {
      const updatedCover = {
        ...card.cover,
        idAttachment: null,
        color: colorName === '' ? null : colorName,
        idCloudImage: null,
        size: size
      }
      dispatch(updateCardDetails({ cardId: card._id, dataUpdate: { cover: updatedCover } }))
      dispatch(updateCardState({ cardId: card._id, columnId: card.columnId, dataUpdate: { cover: updatedCover } }))
      dispatch(updateCoverState({ cover: updatedCover }))
    }
  }

  return (
    <Box
      sx={{
        alignItems: 'start',
        pt: 1,
        pl: 1,
        pr: 0.7,
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative'
      }}
    >
      <Box
        onClick={() => handleOnClick('full')}
        sx={{
          boxShadow:
            selectedSize === 'full' ? (theme) => `0 0 0 2px ${theme.palette.primary.main}` : 'none',
          transition: 'border 0.3s ease',
          cursor: 'pointer',
          borderRadius: 1
        }}
      >
        <Box
          sx={{
            width: '134px',
            height: '62px',
            borderRadius: 1,
            overflow: 'hidden',
            border: 0.1,
            borderColor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#454F59')
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '10px',
              height: '10px',
              borderRadius: 2,
              bgcolor: (theme) =>
                color
                  ? theme.palette.mode === 'light'
                    ? 'rgba(255, 255, 255, 0.5)'
                    : `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.5)`
                  : theme.palette.mode === 'light'
                    ? '#e3e9e6'
                    : '#454F59',
              top: '56px',
              left: '125px',
              right: '4px',
              bottom: '4px'
            }}
          ></Box>
          <Box
            sx={{
              width: '134px',
              height: '28px',
              bgcolor:
                colorName === ''
                  ? (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#454F59')
                  : color
            }}
          ></Box>
          <Box
            sx={{
              height: 'calc(62px - 28px)',
              p: '6px',
              display: 'flex-1'
            }}
          >
            <Box
              sx={{
                width: '122px',
                height: '4px',
                borderRadius: 1,
                bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#454F59')
              }}
            ></Box>
            <Box
              sx={{
                mt: '4px',
                width: '98px',
                height: '4px',
                borderRadius: 1,
                bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#454F59')
              }}
            ></Box>
            <Box
              sx={{
                mt: '6px',
                height: '6px',
                display: 'flex'
              }}
            >
              <Box
                sx={{
                  mr: '2px',
                  width: '16px',
                  height: '100%',
                  borderRadius: 0.5,
                  bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#454F59')
                }}
              ></Box>
              <Box
                sx={{
                  mr: '2px',
                  width: '16px',
                  height: '100%',
                  borderRadius: 0.5,
                  bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#454F59')
                }}
              ></Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        onClick={() => handleOnClick('half')}
        sx={{
          width: '134px',
          height: '62px',
          borderRadius: 1,
          bgcolor:
            colorName === ''
              ? (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#454F59')
              : color,
          overflow: 'hidden',
          border: 0.1,
          borderColor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#454F59'),
          position: 'relative',
          boxShadow:
            selectedSize === 'half' ? (theme) => `0 0 0 2px ${theme.palette.primary.main}` : 'none',
          transition: 'border 0.3s ease',
          cursor: 'pointer'
        }}
      >
        <Box
          sx={{
            height: 'calc(62px - 28px)',
            p: '6px',
            display: 'flex-1',
            position: 'absolute',
            top: '36px'
          }}
        >
          <Box
            sx={{
              width: '122px',
              height: '4px',
              borderRadius: 1,
              bgcolor: (theme) => (theme.palette.mode === 'light' ? 'white' : '#2b2e36')
            }}
          ></Box>
          <Box
            sx={{
              mt: '4px',
              width: '98px',
              height: '4px',
              borderRadius: 1,
              bgcolor: (theme) => (theme.palette.mode === 'light' ? 'white' : '#2b2e36')
            }}
          ></Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ShowSize
