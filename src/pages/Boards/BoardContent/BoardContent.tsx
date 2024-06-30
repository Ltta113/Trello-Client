/* eslint-disable prefer-const */
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
  DropAnimation,
  DragOverEvent,
  closestCorners
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

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
  const [activateDragItemId, setActivateDragItemId] = useState<string | null>(
    null
  )
  const [activateDragItemData, setActivateDragItemData] = useState<
    IColumn | ICard | undefined
  >()
  const [activateDragItemType, setActivateDragItemType] = useState<
    string | null
  >(null)

  const findColumnByCardId = (cardId: string) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    )
  }

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

  const handleDragOver = (event: DragOverEvent) => {
    if (activateDragItemType === ACTIVATE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event

    if (!active || !over) return

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active

    const { id: overCardId } = over

    const activateColumn = findColumnByCardId(activeDraggingCardId as string)
    const overColumn = findColumnByCardId(overCardId as string)

    if (!activateColumn || !overColumn) return

    if (activateColumn._id !== overColumn._id) {
      setOrderedColumns((prev) => {
        const overCardIdex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId
        )

        let newCardIndex: number

        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0

        newCardIndex =
          overCardIdex >= 0
            ? overCardIdex + modifier
            : overColumn?.cards?.length + 1

        const nextColumns: IColumn[] = cloneDeep(prev)
        const nextActiveColumn = nextColumns.find(
          (column) => column._id === activateColumn._id
        )
        const nextOverColumn = nextColumns.find(
          (column) => column._id === overColumn._id
        )

        if (nextActiveColumn) {
          nextActiveColumn.cards = nextActiveColumn.cards.filter(
            (card) => card._id !== activateDragItemId
          )

          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
            (card) => card._id
          )
        }

        if (nextOverColumn) {
          nextOverColumn.cards = nextOverColumn.cards.filter(
            (card) => card._id !== activateDragItemId
          )

          nextOverColumn.cards = nextOverColumn.cards.toSpliced(
            newCardIndex,
            0,
            activeDraggingCardData as ICard
          )

          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
            (card) => card._id
          )
        }

        return nextColumns
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    if (activateDragItemType === ACTIVATE_DRAG_ITEM_TYPE.CARD) {
      return
    }

    const { active, over } = event

    if (!active || !over) return

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
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={closestCorners}
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
          {!activateDragItemType && null}
          {activateDragItemType === ACTIVATE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activateDragItemData as IColumn} />
          )}
          {activateDragItemType === ACTIVATE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activateDragItemData as ICard} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
