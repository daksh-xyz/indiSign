import React, { useState } from "react";
import { SafeAreaView, View, Button, TextInput, StyleSheet } from "react-native";

export const BottomUI = ({ inputText, setInputText, onSubmit }) => {
  return (
    <SafeAreaView edges={["bottom"]}>
      <View style={{ padding: 20 }}>
        <TextInput
          style={styles.input}
          placeholder="Type Something..."
          onChangeText={setInputText}
          value={inputText}
        />
        {/* Call onSubmit when the button is pressed */}
        <Button color={"#224499"} title="Translate" onPress={onSubmit} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#aaaaaa",
    color: "#303030"
  },
});
