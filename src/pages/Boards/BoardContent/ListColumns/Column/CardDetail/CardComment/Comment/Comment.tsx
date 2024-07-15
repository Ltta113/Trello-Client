import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { IComment } from '~/apis/type'
import { timeAgo } from '~/utils/timeAgo'
import { useEffect, useRef, useState } from 'react'
import {
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuControlsContainer,
  MenuButtonUnderline,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
  type RichTextEditorRef
} from 'mui-tiptap'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Button from '@mui/material/Button'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '~/redux/store'
import { deleteCommentState, updateComment } from '~/redux/commentSlide'
import { deleteCommentAPI, updateCommentAPI, updateCommentState } from '~/redux/cardSlice'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

type CommentProps = {
  type: 'create' | 'show'
  comment?: IComment
}

function Comment({ type, comment }: CommentProps) {
  const commentState = useSelector((state: RootState) => state.comment)
  const dispatch = useAppDispatch()

  const [editComment, setEditComment] = useState<boolean>(false)
  const [deleteComment, setDeleteComment] = useState<boolean>(false)
  const editRef = useRef<RichTextEditorRef>(null)

  const commentTime = (): string => {
    if (comment?.updatedAt) {
      return timeAgo(new Date(comment.updatedAt)) + ' (đã sửa)'
    } else if (comment?.createdAt) {
      return timeAgo(new Date(comment.createdAt))
    } else {
      return ''
    }
  }
  const openDelete = () => {
    if (comment?._id) dispatch(deleteCommentState({ commentId: comment._id }))
  }
  const finishDelete = () => {
    dispatch(deleteCommentAPI(comment?._id))
  }
  useEffect(() => {
    if (comment?._id === commentState.commentIdDelete) {
      setDeleteComment(commentState.openDelete)
    } else setDeleteComment(false)
    if (comment?._id === commentState.commentIdUpdate) {
      setEditComment(commentState.openEdit)
    } else setEditComment(false)
  }, [comment?._id, commentState])
  const handleEditComment = (data: string) => {
    dispatch(updateCommentAPI({ commentId: comment?._id, dataUpdate: { description: data } }))
    dispatch(updateCommentState({ commentId: comment?._id, description: data }))
    if (comment?._id) dispatch(updateComment({ commentId: comment?._id }))
    setEditComment(false)
  }
  const handleClickEdit = () => {
    if (comment?._id) dispatch(updateComment({ commentId: comment?._id }))
  }
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        cursor: type === 'show' ? '' : 'pointer',
        position: 'relative'
      }}
    >
      <AccountCircleIcon sx={{ fontSize: 32, color: 'orange' }} />
      <Box sx={{ width: '100%', display: 'flex-1', mb: 1 }}>
        {type === 'show' && (
          <Box sx={{ width: '100%', display: 'flex', gap: 2, pl: 1, mb: 1 }}>
            <Typography sx={{ fontWeight: 'bold' }}>Lê Trương Tuấn Anh</Typography>
            <Box sx={{ fontSize: 12, color: 'text.secondary', mt: 0.4 }}>{commentTime()}</Box>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            ml: 0.5,
            pt: 0.75,
            pl: 1,
            pb: 1,
            height: 'auto',
            borderRadius: 1,
            width: '100%',
            bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e5e5e5' : '#2b2e36'),
            '&:hover': {
              bgcolor:
                type === 'create'
                  ? (theme) => (theme.palette.mode === 'light' ? '#edf2f4' : '#495057')
                  : 'none'
            }
          }}
        >
          {type === 'create' && (
            <Typography sx={{ ml: 0.5, color: 'text.secondary' }} component="div">
              Viết bình luận...
            </Typography>
          )}
          {type !== 'create' && comment && (
            <Typography sx={{ ml: 0.5, color: 'text.primary' }} component="div">
              <div
                dangerouslySetInnerHTML={{
                  __html: comment.description
                }}
              />
            </Typography>
          )}
        </Box>
        {type !== 'create' && comment && !editComment && (
          <Box
            sx={{
              ml: 0.75,
              color: 'text.primary',
              display: 'flex',
              gap: 1,
              textDecoration: 'underline',
              fontSize: 12
            }}
          >
            <Box onClick={handleClickEdit} sx={{ cursor: 'pointer' }}>
              Chỉnh sửa
            </Box>
            <Box onClick={openDelete} sx={{ cursor: 'pointer' }}>
              Xóa
            </Box>
          </Box>
        )}
        {type !== 'create' && comment && editComment && (
          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                ml: 0.5,
                bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2d3436'),
                border: '1px solid',
                borderRadius: 1
              }}
            >
              <RichTextEditor
                ref={editRef}
                extensions={[StarterKit, Underline]}
                content={comment?.description}
                autofocus
                renderControls={() => (
                  <MenuControlsContainer>
                    <MenuSelectHeading />
                    <MenuDivider />
                    <MenuButtonBold />
                    <MenuButtonItalic />
                    <MenuButtonUnderline />
                    <MenuDivider />
                    <MenuButtonOrderedList />
                    <MenuButtonBulletedList />
                  </MenuControlsContainer>
                )}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 2, ml: 0.5, mb: 2 }}>
              <Button
                onClick={() => handleEditComment(editRef.current?.editor?.getHTML() || '')}
                variant="contained"
              >
                Lưu
              </Button>
              <Button onClick={handleClickEdit} variant="text">
                Hủy
              </Button>
            </Box>
          </Box>
        )}
        {type !== 'create' && comment && deleteComment && (
          <Box
            onClick={(e) => e.stopPropagation()}
            data-no-dnd="true"
            sx={{
              position: 'absolute',
              top: '90%',
              left: '0%',
              transform: 'translateX(38%)',
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
                Bạn muốn xoá bình luận này?
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
              Bình luận sẽ bị xóa vĩnh viễn và bạn không thể hoàn tác.
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
    </Box>
  )
}

export default Comment
