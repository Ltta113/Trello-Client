import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SubjectIcon from '@mui/icons-material/Subject'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
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
import { useRef, useState } from 'react'
import { updateCardDetails } from '~/redux/boardSlice'
import { RootState, useAppDispatch } from '~/redux/store'
import { updateDesc } from '~/redux/cardSlice'
import { useSelector } from 'react-redux'
import Button from '@mui/material/Button'

function DetailCard() {
  const dispatch = useAppDispatch()

  const rteRef = useRef<RichTextEditorRef>(null)
  const [editDescription, setEditDescription] = useState<boolean>(false)
  const cardId = useSelector((state: RootState) => state.card.cardId)
  const selectedCard = useSelector((state: RootState) => state.card.card)

  const handleEditDescription = (desc: string) => {
    dispatch(updateCardDetails({ cardId: cardId, dataUpdate: { description: desc } }))
    dispatch(updateDesc(desc))
    setEditDescription(false)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <SubjectIcon sx={{ p: 0.5, fontSize: 30 }} />
        <Typography variant="subtitle1" sx={{ mb: 0, fontWeight: 'bold' }}>
          Mô tả
        </Typography>
      </Box>
      <Box
        onClick={() => setEditDescription(!editDescription)}
        sx={{
          ml: 3.5,
          p: 0.5,
          width: '90%',
          borderRadius: 1,
          cursor: 'pointer',
          '&& .ProseMirror': {
            height: '200px',
            overflowY: 'auto'
          },
          '&:hover': {
            bgcolor: !editDescription
              ? (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2b2e36')
              : 'none'
          }
        }}
      >
        {editDescription && (
          <Box onClick={(e) => e.stopPropagation()}>
            <Box
              sx={{
                bgcolor: (theme) => (theme.palette.mode === 'light' ? '#e3e9e6' : '#2d3436'),
                border: '1px solid',
                borderRadius: 1
              }}
            >
              <RichTextEditor
                ref={rteRef}
                extensions={[StarterKit, Underline]}
                content={selectedCard?.description}
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
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                onClick={() => handleEditDescription(rteRef.current?.editor?.getHTML() || '')}
                variant="contained"
              >
                Lưu
              </Button>
              <Button onClick={() => setEditDescription(!editDescription)} variant="text">
                Hủy
              </Button>
            </Box>
          </Box>
        )}
        {!editDescription && (
          <Box>
            <Typography sx={{ ml: 0.5 }} component="div">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    selectedCard?.description === '<p></p>'
                      ? 'Thêm mô tả'
                      : selectedCard?.description || 'Thêm mô tả'
                }}
              />
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default DetailCard
