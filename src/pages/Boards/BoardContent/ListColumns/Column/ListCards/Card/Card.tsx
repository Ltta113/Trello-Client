/* eslint-disable no-unused-vars */
import { Card as MuiCard } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { ICard } from '~/apis/type'
import React, { HTMLAttributes, useEffect, useRef, useState } from 'react'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useAppDispatch } from '~/redux/store'
import { updateCardDetails, updateCardState } from '~/redux/boardSlice'

type CardProps = {
  card: ICard
} & HTMLAttributes<HTMLDivElement>

function Card({ card, ...props }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })

  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [titleCard, setTitleCard] = useState<string | undefined>(card?.title)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const dispatch = useAppDispatch()
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsEditing(false)
        setTitleCard(card?.title)
      }
    }

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [card?.title, dispatch, isEditing])

  const handleEditClick = async () => {
    setIsEditing(true)
  }

  const handleSaveClick = async () => {
    setIsEditing(false)
    dispatch(updateCardDetails({ cardId: card._id, dataUpdate: { title: titleCard } }))
    dispatch(updateCardState({ cardId: card._id, title: titleCard, columnId: card.columnId }))
  }

  const dndKitCardStyles: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }

  const shouldShowCardAction = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
  }

  return (
    <Box
      ref={cardRef}
      className="no-blur"
      sx={{
        position: 'relative',
        '&:hover .edit-icon': {
          visibility: 'visible'
        }
      }}
    >
      <MuiCard
        ref={setNodeRef}
        style={dndKitCardStyles}
        {...props}
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
          overflow: 'unset',
          display: card?.FE_PlaceholderCard ? 'none' : 'block',
          border: '1px solid transparent',
          '&:hover': isEditing
            ? { border: 'none' }
            : { borderColor: (theme) => theme.palette.primary.main },
          minHeight: isEditing ? 200 : 'auto'
        }}
      >
        {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}
        <CardContent
          sx={{
            p: 1.5,
            '&:last-child': { p: 1.5 },
            position: 'relative'
          }}
        >
          {isEditing ? (
            <TextField
              value={titleCard}
              onChange={(e) => setTitleCard(e.target.value)}
              variant="outlined"
              data-no-dnd="true"
              fullWidth
              autoFocus
              multiline
              rows={9}
              size="medium"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                '& .MuiInputBase-root': {
                  height: 200
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <Typography>{card?.title}</Typography>
          )}
        </CardContent>
        {shouldShowCardAction() && (
          <CardActions sx={{ p: '0 4px 8px 4px' }}>
            {!!card?.memberIds?.length && (
              <Button size="small" startIcon={<GroupIcon />}>
                {card?.memberIds?.length}
              </Button>
            )}
            {!!card?.comments?.length && (
              <Button size="small" startIcon={<CommentIcon />}>
                {card?.comments?.length}
              </Button>
            )}
            {!!card?.attachments?.length && (
              <Button size="small" startIcon={<AttachmentIcon />}>
                {card?.attachments?.length}
              </Button>
            )}
          </CardActions>
        )}
      </MuiCard>
      {isEditing && (
        <Box sx={{ bottom: 8, left: 8 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSaveClick}
            sx={{
              filter: 'none !important'
            }}
          >
            Lưu
          </Button>
        </Box>
      )}

      <Tooltip title="Edit">
        <IconButton
          onClick={isEditing ? handleSaveClick : handleEditClick}
          size="small"
          className="edit-icon"
          sx={{
            position: 'absolute',
            top: 5,
            right: 5,
            visibility: 'hidden'
          }}
        >
          <EditOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default Card
