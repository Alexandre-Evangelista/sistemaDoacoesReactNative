import { StyleSheet } from "react-native";

export const bottomMenuStyles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    minHeight: 90,
    paddingTop: 14,
    paddingBottom: 45,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  labelActive: {
    color: "#16A34A",
    fontWeight: "700",
  },
});