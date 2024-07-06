/* eslint-disable prefer-const */
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { IBoard, ICard, IColumn } from '~/apis/type'
import { mapOrder } from '~/utils/sort'
import {
  DndContext,
  DragEndEvent,
  useSensors,
  useSensor,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
  DragOverEvent,
  closestCorners,
  CollisionDetection,
  pointerWithin,
  getFirstCollision,
  UniqueIdentifier
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLib/DndKitSensors'
import { useEffect, useState, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholder } from '~/utils/formatters'
import { useAppDispatch } from '~/redux/store'
import {
  moveCardToDiffColumnAPI,
  updateBoardDetails,
  updateColumnDetails
} from '~/redux/boardSlice'

interface BoardBarProps {
  board: IBoard | undefined
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
    if (board?.columns && board?.columnOrderIds) {
      setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
    }
  }, [board])

  const dispatch = useAppDispatch()

  const lastOverId = useRef<UniqueIdentifier | null>(null)
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
  const [oldColumn, setOldColumn] = useState<IColumn | undefined>()

  const findColumnByCardId = (cardId: string) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    )
  }

  const moveCardDiffColumn = (
    overColumn: IColumn,
    overCardId: string,
    active: DragEndEvent['active'] | DragOverEvent['active'],
    over: DragEndEvent['over'] | DragOverEvent['over'],
    activateColumn: IColumn,
    activeDraggingCardData: ICard,
    triggerFrom?: string
  ) => {
    if (!active || !over) return

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

        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholder(nextActiveColumn)]
        }

        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        )
      }

      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activateDragItemId
        )
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        } as ICard)

        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        )

        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        )
      }

      let prevCardOrderIds = orderedColumns.find((c) => c._id === oldColumn?._id )?.cardOrderIds
      if (prevCardOrderIds && prevCardOrderIds[0].includes('placeholder-card')) {
        prevCardOrderIds = []
      }

      if (triggerFrom === 'handleDragEnd') {
        const dataUpdate = {
          cardId: activateDragItemId,
          prevColumnId: oldColumn?._id,
          prevCardOrderIds,
          nextColumnId: nextActiveColumn?._id,
          nextCardOrderIds: orderedColumns.find(
            (c) => c._id === nextActiveColumn?._id
          )?.cardOrderIds
        }
        dispatch(moveCardToDiffColumnAPI(dataUpdate))
      }

      return nextColumns
    })
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

    if (event?.active?.data?.current?.columnId) {
      setOldColumn(findColumnByCardId(event?.active?.id as string))
    }
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
      moveCardDiffColumn(
        overColumn,
        overCardId as string,
        active,
        over,
        activateColumn,
        activeDraggingCardData as ICard,
        'handleDragOver'
      )
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (activateDragItemType === ACTIVATE_DRAG_ITEM_TYPE.CARD) {
      if (!active || !over) return
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active

      const { id: overCardId } = over

      const activateColumn = findColumnByCardId(activeDraggingCardId as string)
      const overColumn = findColumnByCardId(overCardId as string)

      if (!activateColumn || !overColumn) return

      if (oldColumn?._id !== overColumn._id) {
        moveCardDiffColumn(
          overColumn,
          overCardId as string,
          active,
          over,
          activateColumn,
          activeDraggingCardData as ICard,
          'handleDragEnd'
        )
      } else {
        const oldIndex = oldColumn?.cards?.findIndex(
          (c) => c._id === activateDragItemId
        )
        const newIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        )

        const dndOrderedCards = arrayMove<ICard>(
          oldColumn?.cards,
          oldIndex,
          newIndex
        )
        const dndOrderedCardIds = dndOrderedCards.map((c) => c._id)
        dispatch(
          updateColumnDetails({
            columnId: oldColumn?._id as string,
            dataUpdate: { cardOrderIds: dndOrderedCardIds }
          })
        )
        setOrderedColumns((prev) => {
          const nextColumns: IColumn[] = cloneDeep(prev)

          const targetColumn = nextColumns.find((c) => c._id === overColumn._id)

          if (targetColumn) {
            targetColumn.cards = dndOrderedCards
            targetColumn.cardOrderIds = dndOrderedCardIds
          }

          return nextColumns
        })
      }
    }

    if (activateDragItemType === ACTIVATE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over?.id) {
        const oldIndex = orderedColumns.findIndex((c) => c._id === active.id)
        const newIndex = orderedColumns.findIndex((c) => c._id === over?.id)
        const dndOrderedColumns = arrayMove<IColumn>(
          orderedColumns,
          oldIndex,
          newIndex
        )
        const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
        dispatch(
          updateBoardDetails({
            boardId: board?._id as string,
            dataUpdate: { columnOrderIds: dndOrderedColumnsIds }
          })
        )
        setOrderedColumns(dndOrderedColumns)
      }
    }
    setActivateDragItemId(null)
    setActivateDragItemType(null)
    setActivateDragItemData(undefined)
    setOldColumn(undefined)
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

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activateDragItemType === ACTIVATE_DRAG_ITEM_TYPE.COLUMN)
        return closestCorners({ ...args })

      const pointerIntersecion = pointerWithin(args)

      if (!pointerIntersecion?.length) return []

      // const intersections =
      //   pointerIntersecion?.length > 0
      //     ? pointerIntersecion
      //     : rectIntersection(args)

      let overId = getFirstCollision(pointerIntersecion, 'id')

      if (overId) {
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId
        )
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id as string)
                )
              }
            )
          })[0]?.id
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activateDragItemType, orderedColumns]
  )

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
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
