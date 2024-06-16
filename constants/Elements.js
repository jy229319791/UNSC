// Hammaad
// Created global styles for elements across the app
const scrollContainer = {
  flexGrow: 1,
  justifyContent: "center",
  padding: 20,
};

const container = {
  flex: 1,
  width: "100%",
  backgroundColor: "#f5f5f5",
  padding: 20,
  borderRadius: 8,
};

const title = {
  fontSize: 32,
  fontWeight: "bold",
  color: "#3a50e0",
  marginBottom: 20,
  textAlign: "left",
  width: "100%",
};

const text = {
  fontSize: 16,
  color: "#333",
  marginVertical: 10,
  textAlign: "left",
  width: "100%",
};

const input = {
  height: 50,
  flex: 1,
  marginVertical: 10,
  borderWidth: 1,
  borderColor: "#ddd",
  padding: 10,
  borderRadius: 8,
  backgroundColor: "#fff",
};

const inlineContainer = {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "transparent",
};

const iconButton = {
  backgroundColor: "#3a50e0",
  padding: 10,
  borderRadius: 8,
  marginLeft: 10,
};

const submitButton = {
  backgroundColor: "#3a50e0",
  paddingVertical: 15,
  borderRadius: 25,
  marginVertical: 20,
  alignItems: "center",
  justifyContent: "center",
  padding: 15,
  borderRadius: 50,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const submitButtonText = {
  color: "#fff",
  fontSize: 16,
};

const separator = {
  marginVertical: 30,
  height: 1,
  width: "80%",
};

const tagContainer = {
  backgroundColor: "#9da8f0",
  width: "min-content",
  paddingHorizontal: 22,
  opacity: 0.8,
  paddingVertical: 5,
  borderRadius: 3.5,
  marginVertical: 5,
};

const tagText = {
  color: "#3a50e0",
  fontWeight: "600",
};
// End Hammaad's work

// add every element to this export
export {
  scrollContainer,
  container,
  title,
  text,
  input,
  inlineContainer,
  iconButton,
  submitButton,
  submitButtonText,
  separator,
  tagContainer,
  tagText,
};
