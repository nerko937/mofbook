import { StyleSheet, View, TextInput, Button } from "react-native";
import { useState } from "react";

type CommonSubmitterProps = {
  externalHandler: (text: string) => void;
};

const TextSubmitter = ({ externalHandler }: CommonSubmitterProps) => {
  const [text, setText] = useState("");

  const internalHandler = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    externalHandler(trimmed);
    setText("");
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        testID="text-submitter-input"
        style={styles.input}
        value={text}
        onChangeText={setText}
        onSubmitEditing={internalHandler}
        placeholder="New Todo"
      />
      <Button
        testID="text-submitter-btn-submit"
        title="Add"
        onPress={internalHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
});

export default TextSubmitter;
