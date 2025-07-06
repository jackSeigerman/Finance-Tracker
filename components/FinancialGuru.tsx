import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

interface FinancialGuruProps {}

const FinancialGuru: React.FC<FinancialGuruProps> = ({}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput placeholder="Enter transaction" style={styles.input} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  input: {
    width: "100%",
    fontSize: 16,
    borderRadius: 12,
  },
});

export default FinancialGuru;
