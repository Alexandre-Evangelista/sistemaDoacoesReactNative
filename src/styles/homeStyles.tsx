import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },

  // ── Header ──────────────────────────────
  header: {
  marginBottom: 20,
},
headerTop: {
  flexDirection: "row",
  justifyContent: "flex-end",  // botão sair grudado na direita
  marginBottom: 8,
},
headerBottom: {
  flexDirection: "row",
  alignItems: "center",
},
  hello: {
    fontSize: 16,
    color: "#888",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
  },

  // ── Botão Sair ──────────────────────────
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  logoutText: {
    color: "#DC2626",
    fontWeight: "600",
    fontSize: 13,
  },

  // ── Busca ───────────────────────────────
  search: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
  },

  // ── Seção campanhas ─────────────────────
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },

  // ── Botão Criar ─────────────────────────
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#16A34A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },

  // ── Card ────────────────────────────────
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 15,
    marginBottom: 12,
    backgroundColor: "#ccc",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  cardSubtitle: {
    marginTop: 5,
    color: "#666",
  },
  location: {
    marginTop: 10,
    color: "#888",
  },
});