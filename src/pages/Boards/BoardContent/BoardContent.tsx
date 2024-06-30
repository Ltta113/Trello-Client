import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { IBoard, ICard, IColumn } from '~/apis/type'
import { mapOrder } from '~/utils/sort'
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensors,
  useSensor,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

interface BoardBarProps {
  board: IBoard
}

const ACTIVATE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVATE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVATE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board }: BoardBarProps) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 500 }
  })

  const sensors = useSensors(mouseSensor, touchSensor)
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const [orderedColumns, setOrderedColumns] = useState<IColumn[]>([])
  const [activateDragItemId, setActivateDragItemId] = useState<string | null>(null)
  const [activateDragItemData, setActivateDragItemData] = useState<IColumn | ICard | undefined>()
  const [activateDragItemType, setActivateDragItemType] = useState<string | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event?.active?.id as string
    const activeData = event?.active?.data?.current as IColumn | ICard

    setActivateDragItemId(activeId)
    setActivateDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVATE_DRAG_ITEM_TYPE.CARD
        : ACTIVATE_DRAG_ITEM_TYPE.COLUMN
    )
    setActivateDragItemData(activeData)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id)
      const newIndex = orderedColumns.findIndex((c) => c._id === over?.id)
      const dndOrderedColumns = arrayMove<IColumn>(
        orderedColumns,
        oldIndex,
        newIndex
      )
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      setOrderedColumns(dndOrderedColumns)
    }
    setActivateDragItemId(null)
    setActivateDragItemType(null)
    setActivateDragItemData(undefined)
  }

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {(!activateDragItemType) && null}
          {(activateDragItemType === ACTIVATE_DRAG_ITEM_TYPE.COLUMN && <Column column={activateDragItemData as IColumn}/>)}
          {(activateDragItemType === ACTIVATE_DRAG_ITEM_TYPE.CARD && <Card card={activateDragItemData as ICard}/>)}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
