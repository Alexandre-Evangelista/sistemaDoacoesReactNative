import {StyleSheet} from "react-native";

export const signUpStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 22,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
  },

  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 6,
    marginBottom: 25,
  },

  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  separatorText: {
    marginHorizontal: 12,
    color: "#9CA3AF",
  },

  googleButton: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  googleText: {
    fontSize: 15,
    color: "#374151",
  },

  footerText: {
    textAlign: "center",
    marginTop: 22,
    color: "#9CA3AF",
  },

  loginText: {
    color: "#00C853",
    fontWeight: "600",
  },
});