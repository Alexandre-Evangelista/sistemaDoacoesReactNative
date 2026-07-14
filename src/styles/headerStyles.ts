import { StyleSheet } from "react-native";

export const headerStyles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 16,
    zIndex: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 30,
  },
  logoutIcon: {
    marginRight: 4,
  },
  logoutText: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 13,
  },
});