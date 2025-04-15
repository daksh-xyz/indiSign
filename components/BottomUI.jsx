import React, { useState } from "react";
import { SafeAreaView, View, Button, TextInput, StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme.web";

export const BottomUI = ({ inputText, setInputText, onSubmit }) => {
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? "#303030" : "#f0ecec";
  const bgcolor = colorScheme === 'dark' ? "#aaaaaa" : "#f0ecec";
  return (
    <SafeAreaView edges={["bottom"]}>
      <View style={{ padding: 20, backgroundColor: color}}>
        <TextInput
          style={[styles.input, {backgroundColor: bgcolor}]}
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
    color: '#3030'
  },
});
