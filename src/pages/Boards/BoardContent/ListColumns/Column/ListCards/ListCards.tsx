/* eslint-disable no-unused-vars */
import Box from '@mui/material/Box'
import Card from './Card/Card'
import { ICard } from '~/apis/type'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface CarsProps {
  cards: ICard[]
  onCardClick: (cardId: string) => void
}

function ListCards({ cards, onCardClick }: CarsProps) {
  return (
    <SortableContext items={cards?.map((c) => c._id)} strategy={verticalListSortingStrategy}>
      <Box
        sx={{
          p: '0 5px 5px 5px',
          m: '0 5px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: (theme) => `calc(
              ${theme.trello.boardContentHeight} - 
              ${theme.spacing(5)} - 
              ${theme.trello.columnHeaderHeight} -
              ${theme.trello.columnFooterHeight})`,
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#bfc2cf'
          },
          '&::-webkit-scrollbar': { width: '7px' }
        }}
      >
        {cards?.map((card) => (
          <Card key={card._id} card={card} onClick={() => onCardClick(card._id)} />
        ))}
      </Box>
    </SortableContext>
  )
}

export default ListCards
