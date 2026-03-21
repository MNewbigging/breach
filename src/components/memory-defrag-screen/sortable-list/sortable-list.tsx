import { DragDropEventHandlers, DragDropProvider } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from "react";

type WithId = { id: string };

interface SortableListProps<T extends WithId> {
  items: T[];
  itemRenderer: (item: T) => ReactElement;
}

// Takes an array and allows visual sorting of it without changing the array in place
export function SortableList<T extends WithId>({
  items,
  itemRenderer,
}: SortableListProps<T>) {
  const [listOrder, setListOrder] = useState<string[]>(
    items.map((item) => item.id),
  );

  // Get a stable signature of items in case array changes in-place from parent
  const itemIds = items.map((item) => item.id).join("|");

  // Store items to retrieve when calling itemRenderer
  const itemsById = useMemo(() => {
    console.log("itemsById");
    return new Map(items.map((item) => [item.id, item]));
  }, [itemIds]);

  // Whenever items would change
  useEffect(() => {
    console.log("useEffect");
    setListOrder((current) => {
      const nextIds = items.map((item) => item.id);

      // Preserve order of existing items and add new at the end
      const kept = current.filter((id) => nextIds.includes(id)); // will handle removals
      const appended = nextIds.filter((id) => !kept.includes(id));

      return [...kept, ...appended];
    });
  }, [itemIds]);

  // Handle successful drag events
  function handleDragEnd(
    event: Parameters<DragDropEventHandlers["onDragEnd"]>[0],
  ) {
    if (event.canceled) return;

    const { source } = event.operation;
    if (!isSortable(source)) return;

    const { initialIndex, index } = source;
    if (initialIndex === index) return;

    setListOrder((current) => {
      // Handle position swap
      const next = [...current];
      const [removed] = next.splice(initialIndex, 1);
      next.splice(index, 0, removed);
      return next;
    });
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      {listOrder.map((id, index) => {
        const item = itemsById.get(id);
        if (!item) return null;

        const el = itemRenderer(item);

        return (
          <SortableItem key={id} id={id} index={index}>
            {el}
          </SortableItem>
        );
      })}
    </DragDropProvider>
  );
}

interface SortableItemProps {
  id: string;
  index: number;
}

function SortableItem({
  children,
  id,
  index,
}: PropsWithChildren<SortableItemProps>) {
  const { ref } = useSortable({ id, index });

  return (
    <div ref={ref} style={{ touchAction: "none" }}>
      {children}
    </div>
  );
}
