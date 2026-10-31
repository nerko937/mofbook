import { Button, StyleSheet, View, Text, Modal } from "react-native";

type ConfirmationModalProps = {
  visible: boolean;
  onConfirmation: () => void;
  onDismiss: () => void;
};

const ConfirmationModal = ({
  visible,
  onConfirmation,
  onDismiss,
}: ConfirmationModalProps) => {
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.text}>Are you sure?</Text>
          <Button
            testID="confirmation-modal-btn-confirm"
            title="Yes"
            color="red"
            onPress={onConfirmation}
          />
          <Button
            testID="confirmation-modal-btn-dismiss"
            title="Cancel"
            onPress={onDismiss}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    minWidth: 250,
    gap: 10,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default ConfirmationModal;
