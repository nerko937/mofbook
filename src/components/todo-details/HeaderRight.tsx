import { Button } from "react-native";

type HeaderRightProps = {
  selectedCount: number;
  onDeleteSelected: () => void;
  onDeleteTodo: () => void;
};

const HeaderRight = ({
  selectedCount,
  onDeleteSelected,
  onDeleteTodo,
}: HeaderRightProps) => {
  return selectedCount > 0 ? (
    <Button
      testID="delete-items-btn-del-checked"
      title={`Delete (${selectedCount})`}
      color="red"
      onPress={onDeleteSelected}
    />
  ) : (
    <Button
      testID="delete-todo-btn-modal-opn"
      title="Delete whole todo"
      color="red"
      onPress={onDeleteTodo}
    />
  );
};

export default HeaderRight;
