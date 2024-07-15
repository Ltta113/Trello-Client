import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '~/redux/store'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
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
import Comment from './Comment/Comment'
import { createNewComment } from '~/redux/cardSlice'

function CardComment() {
  const dispatch = useAppDispatch()
  const rteRef = useRef<RichTextEditorRef>(null)
  const [createComment, setCreateComment] = useState<boolean>(false)
  const cardId = useSelector((state: RootState) => state.card.cardId)
  const card = useSelector((state: RootState) => state.card.card)

  const handleCreateComment = (comment: string) => {
    dispatch(createNewComment({ cardId: cardId, description: comment }))
    setCreateComment(false)
  }

  return (
    <Box sx={{ mt: 2, width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <FormatListBulletedIcon sx={{ p: 0.5, fontSize: 30 }} />
        <Typography variant="subtitle1" sx={{ mb: 0, fontWeight: 'bold' }}>
          Hoạt động
        </Typography>
      </Box>
      <Box
        sx={{
          width: '94%',
          borderRadius: 1,
          display: 'flex-1',
          '&& .ProseMirror': {
            height: '70px',
            minWidth: '100%',
            overflowY: 'auto'
          }
        }}
      >
        {createComment && (
          <Box onClick={(e) => e.stopPropagation()} sx={{ width: '100%', display: 'flex' }}>
            <AccountCircleIcon sx={{ fontSize: 32, color: 'orange' }} />
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
                  ref={rteRef}
                  extensions={[StarterKit, Underline]}
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
                  onClick={() => handleCreateComment(rteRef.current?.editor?.getHTML() || '')}
                  variant="contained"
                >
                  Lưu
                </Button>
                <Button onClick={() => setCreateComment(!createComment)} variant="text">
                  Hủy
                </Button>
              </Box>
            </Box>
          </Box>
        )}
        {!createComment && (
          <Box sx={{ width: '100%' }} onClick={() => setCreateComment(!createComment)}>
            <Comment type="create" />
          </Box>
        )}
        <Box sx={{ display: 'flex-1', width: '100%' }}>
          <Box sx={{ display: 'flex-1', width: '100%' }}>
            {card?.comments &&
              card.comments.map((comment) => (
                <Comment key={comment._id} type="show" comment={comment} />
              ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CardComment
