import CheckList from './ListCheckLists/CheckList/CheckList'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '~/redux/store'
import { mapOrder } from '~/utils/sort'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
  DragOverEvent,
  UniqueIdentifier,
  useSensor,
  useSensors,
  closestCorners,
  pointerWithin,
  getFirstCollision,
  CollisionDetection
} from '@dnd-kit/core'
import { useEffect, useState, useRef, useCallback } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { ICheckItem, ICheckList } from '~/apis/type'
import { cloneDeep, isEmpty } from 'lodash'
import ListCheckLists from './ListCheckLists/ListCheckLists'
import CheckItem from './ListCheckLists/CheckList/ListItem/CheckItem/CheckItem'
import { generatePlaceholderCI } from '~/utils/formatters'
import {
  moveCheckItemToDiffAPI,
  moveCheckItemToDiffState,
  moveCheckList,
  updateCheckList
} from '~/redux/cardSlice'
import { MouseSensor } from '~/customLib/DndKitSensors'

const ACTIVATE_DRAG_ITEM_TYPE = {
  CHECK_LIST: 'ACTIVATE_DRAG_ITEM_TYPE_CHECK_LIST',
  CHECK_ITEM: 'ACTIVATE_DRAG_ITEM_TYPE_CHECK_ITEM'
}

function CardContent() {
  const card = useSelector((state: RootState) => state.card.card)
  const dispatch = useAppDispatch()
  const [orderedCheckList, setOrderedCheckList] = useState<ICheckList[]>([])
  const [activateDragItemId, setActivateDragItemId] = useState<string | null>(null)
  const [activateDragItemData, setActivateDragItemData] = useState<ICheckList | ICheckItem>()
  const [activateDragItemType, setActivateDragItemType] = useState<string | null>(null)
  const [oldCheckList, setOldCheckList] = useState<ICheckList | undefined>()
  const lastOverId = useRef<UniqueIdentifier | null>(null)

  useEffect(() => {
    if (card?.checkLists && card?.checkListOrderIds) {
      setOrderedCheckList(mapOrder(card.checkLists, card.checkListOrderIds, '_id'))
    }
  }, [card])

  const findCLByCLId = (checkListId: string) => {
    return orderedCheckList.find((card) =>
      card?.checkItems?.map((checkList) => checkList._id)?.includes(checkListId)
    )
  }

  const moveCIDiffCL = (
    overCheckList: ICheckList,
    active: DragEndEvent['active'] | DragOverEvent['active'],
    over: DragEndEvent['over'] | DragOverEvent['over'],
    activateCheckList: ICheckList,
    newCheckItemIndex: number,
    activeDraggingCheckItemData: ICheckItem,
    triggerFrom?: string
  ) => {
    if (!active || !over) return

    setOrderedCheckList((prev) => {
      const nextCheckLists: ICheckList[] = cloneDeep(prev)
      const nextActiveCheckList = nextCheckLists.find(
        (checkList) => checkList._id === activateCheckList._id
      )
      const nextOverCheckList = nextCheckLists.find(
        (checkList) => checkList._id === overCheckList._id
      )

      if (nextActiveCheckList) {
        nextActiveCheckList.checkItems = nextActiveCheckList.checkItems.filter(
          (checkItem) => checkItem._id !== activateDragItemId
        )

        if (isEmpty(nextActiveCheckList.checkItems)) {
          nextActiveCheckList.checkItems = [generatePlaceholderCI(nextActiveCheckList)]
        }

        nextActiveCheckList.listItemOrderIds = nextActiveCheckList.checkItems.map(
          (checkItem) => checkItem._id
        )
      }

      if (nextOverCheckList) {
        nextOverCheckList.checkItems = nextOverCheckList.checkItems.filter(
          (checkItem) => checkItem._id !== activateDragItemId
        )
        nextOverCheckList.checkItems = nextOverCheckList.checkItems.toSpliced(
          newCheckItemIndex,
          0,
          {
            ...activeDraggingCheckItemData,
            checkListId: nextOverCheckList._id
          } as ICheckItem
        )

        nextOverCheckList.checkItems = nextOverCheckList.checkItems.filter(
          (checkList) => !checkList.FE_PlaceholderCheckList
        )

        nextOverCheckList.listItemOrderIds = nextOverCheckList.checkItems.map(
          (checkItem) => checkItem._id
        )
      }

      let prevCIOrderIds = orderedCheckList.find(
        (c) => c._id === oldCheckList?._id
      )?.listItemOrderIds
      if (prevCIOrderIds && prevCIOrderIds[0].includes('placeholder-checklist')) {
        prevCIOrderIds = []
      }
      if (triggerFrom === 'handleDragEnd') {
        const dataUpdate = {
          checkItemId: activateDragItemId,
          prevCheckListId: oldCheckList?._id,
          prevCheckItemOrderIds: prevCIOrderIds,
          nextCheckListId: nextActiveCheckList?._id,
          nextCheckItemOrderIds: nextOverCheckList?.listItemOrderIds
        }
        dispatch(
          moveCheckItemToDiffState({
            checkItemId: activateDragItemId,
            prevCheckListId: oldCheckList?._id,
            nextCheckListId: nextActiveCheckList?._id,
            newCIIndex: newCheckItemIndex,
            checkItemData: activeDraggingCheckItemData
          })
        )
        dispatch(moveCheckItemToDiffAPI(dataUpdate))
      }

      return nextCheckLists
    })
  }
  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event?.active?.id as string
    const activeData = event?.active?.data?.current as ICheckItem | ICheckList

    setActivateDragItemId(activeId)
    setActivateDragItemType(
      event?.active?.data?.current?.checkListId
        ? ACTIVATE_DRAG_ITEM_TYPE.CHECK_ITEM
        : ACTIVATE_DRAG_ITEM_TYPE.CHECK_LIST
    )
    setActivateDragItemData(activeData)

    if (event?.active?.data?.current?.checkListId) {
      setOldCheckList(findCLByCLId(event?.active?.id as string))
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (activateDragItemType === ACTIVATE_DRAG_ITEM_TYPE.CHECK_LIST) return

    const { active, over } = event

    if (!active || !over) return
    const {
      id: activeDraggingCIId,
      data: { current: activeDraggingCIData }
    } = active

    const { id: overCIId } = over

    const activateCheckList = findCLByCLId(activeDraggingCIId as string)
    const overCheckList = findCLByCLId(overCIId as string)

    if (!activateCheckList || !overCheckList) return

    if (activateCheckList._id !== overCheckList._id) {
      const overCheckItemIdex = overCheckList?.checkItems?.findIndex(
        (checkItem) => checkItem._id === overCIId
      )
      let newCIIndex: number = 0

      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0

      newCIIndex =
        overCheckItemIdex >= 0
          ? overCheckItemIdex + modifier
          : overCheckList?.checkItems?.length + 1

      moveCIDiffCL(
        overCheckList,
        active,
        over,
        activateCheckList,
        newCIIndex,
        activeDraggingCIData as ICheckItem,
        'handleDragOver'
      )
    }
  }
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (activateDragItemType === ACTIVATE_DRAG_ITEM_TYPE.CHECK_ITEM) {
      if (!active || !over) return
      const {
        id: activeDraggingCIId,
        data: { current: activeDraggingCIData }
      } = active

      const { id: overCIId } = over

      const activateCheckList = findCLByCLId(activeDraggingCIId as string)
      const overCheckList = findCLByCLId(overCIId as string)

      if (!activateCheckList || !overCheckList) return

      if (oldCheckList?._id !== overCheckList._id) {
        const overCheckItemIdex = overCheckList?.checkItems?.findIndex(
          (checkItem) => checkItem._id === overCIId
        )
        let newCIIndex: number = 0

        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0

        newCIIndex =
          overCheckItemIdex >= 0
            ? overCheckItemIdex + modifier
            : overCheckList?.checkItems?.length + 1

        moveCIDiffCL(
          overCheckList,
          active,
          over,
          activateCheckList,
          newCIIndex,
          activeDraggingCIData as ICheckItem,
          'handleDragEnd'
        )
      } else {
        const oldIndex = oldCheckList?.checkItems?.findIndex((c) => c._id === activateDragItemId)
        const newIndex = overCheckList?.checkItems?.findIndex((c) => c._id === overCIId)
        const dndOrderedCheckItems = arrayMove<ICheckItem>(
          oldCheckList?.checkItems,
          oldIndex,
          newIndex
        )
        const dndOrderedCheckItemsIds = dndOrderedCheckItems.map((c) => c._id)

        setOrderedCheckList((prev) => {
          const nextCheckLists: ICheckList[] = cloneDeep(prev)

          const targetCheckList = nextCheckLists.find((c) => c._id === oldCheckList._id)

          if (targetCheckList) {
            targetCheckList.checkItems = dndOrderedCheckItems
            targetCheckList.listItemOrderIds = dndOrderedCheckItemsIds
          }
          return nextCheckLists
        })
        dispatch(
          updateCheckList({
            checkListId: oldCheckList?._id as string,
            dataUpdate: { listItemOrderIds: dndOrderedCheckItemsIds }
          })
        )
      }
    }

    if (activateDragItemType === ACTIVATE_DRAG_ITEM_TYPE.CHECK_LIST) {
      if (active.id !== over?.id) {
        const oldIndex = orderedCheckList.findIndex((c) => c._id === active.id)
        const newIndex = orderedCheckList.findIndex((c) => c._id === over?.id)
        const dndOrderedCheckList = arrayMove<ICheckList>(orderedCheckList, oldIndex, newIndex)
        const dndOrderedCheckListIds = dndOrderedCheckList.map((c) => c._id)

        // dispatch(
        //   updateMoveColumnState({
        //     listColumn: dndOrderedColumns,
        //     listColumnIds: dndOrderedColumnsIds
        //   })
        // )

        dispatch(
          moveCheckList({
            cardId: card?._id as string,
            dataUpdate: { checkListOrderIds: dndOrderedCheckListIds }
          })
        )
        setOrderedCheckList(dndOrderedCheckList)
      }
    }
    setActivateDragItemId(null)
    setActivateDragItemType(null)
    setActivateDragItemData(undefined)
    setOldCheckList(undefined)
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
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })
  const sensors = useSensors(mouseSensor)

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activateDragItemType === ACTIVATE_DRAG_ITEM_TYPE.CHECK_LIST)
        return closestCorners({ ...args })

      const pointerIntersecion = pointerWithin(args)

      if (!pointerIntersecion?.length) return []

      let overId = getFirstCollision(pointerIntersecion, 'id')

      if (overId) {
        const checkCheckList = orderedCheckList.find((checkList) => checkList._id === overId)
        if (checkCheckList) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter((container) => {
              return (
                container.id !== overId &&
                checkCheckList?.listItemOrderIds?.includes(container.id as string)
              )
            })
          })[0]?.id
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activateDragItemType, orderedCheckList]
  )

  const [progress, setProgress] = useState<number>(0)

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
    >
      <ListCheckLists checkLists={orderedCheckList || []} />
      <DragOverlay dropAnimation={dropAnimation}>
        {!activateDragItemType && null}
        {activateDragItemType === ACTIVATE_DRAG_ITEM_TYPE.CHECK_LIST && (
          <CheckList checkList={activateDragItemData as ICheckList} />
        )}
        {activateDragItemType === ACTIVATE_DRAG_ITEM_TYPE.CHECK_ITEM && (
          <CheckItem
            checkItem={activateDragItemData as ICheckItem}
            progress={progress}
            setProgress={setProgress}
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default CardContent
