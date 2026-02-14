import type { CSSProperties } from "react";
import type { GuardianStatus } from "../lib/types";

export const layoutStyles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    padding: "24px 16px 40px"
  } satisfies CSSProperties,
  content: {
    maxWidth: "760px",
    margin: "0 auto",
    display: "grid",
    gap: "16px"
  } satisfies CSSProperties,
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px"
  } satisfies CSSProperties,
  sectionTitle: {
    margin: 0,
    fontSize: "20px",
    lineHeight: 1.3,
    fontWeight: 650,
    letterSpacing: "-0.01em"
  } satisfies CSSProperties,
  mutedText: {
    margin: 0,
    color: "#475569",
    fontSize: "14px",
    lineHeight: 1.5
  } satisfies CSSProperties
};

export const rowStyles = {
  wrap: {
    marginTop: "12px",
    display: "grid",
    gap: "8px"
  } satisfies CSSProperties,
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    fontSize: "14px",
    lineHeight: 1.4
  } satisfies CSSProperties,
  label: {
    color: "#334155"
  } satisfies CSSProperties,
  value: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    color: "#0f172a"
  } satisfies CSSProperties
};

const badgeBaseStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: "999px",
  padding: "2px 10px",
  fontSize: "12px",
  lineHeight: 1.6,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.03em"
};

const buttonBaseStyle: CSSProperties = {
  border: "1px solid",
  borderRadius: "10px",
  padding: "8px 14px",
  fontSize: "14px",
  lineHeight: 1.4,
  fontWeight: 600,
  cursor: "pointer"
};

const toneStyles = {
  neutral: { backgroundColor: "#e2e8f0", color: "#0f172a" },
  success: { backgroundColor: "#dcfce7", color: "#166534" },
  warning: { backgroundColor: "#ffedd5", color: "#9a3412" },
  danger: { backgroundColor: "#fee2e2", color: "#991b1b" }
};

export function statusBadgeStyle(status: GuardianStatus): CSSProperties {
  const tone = status === "running" ? toneStyles.success : status === "error" ? toneStyles.danger : toneStyles.neutral;
  return {
    ...badgeBaseStyle,
    ...tone
  };
}

export function boolBadgeStyle(enabled: boolean): CSSProperties {
  return {
    ...badgeBaseStyle,
    ...(enabled ? toneStyles.success : toneStyles.warning)
  };
}

export const buttonStyles = {
  group: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "12px"
  } satisfies CSSProperties,
  primary: {
    ...buttonBaseStyle,
    backgroundColor: "#0f172a",
    borderColor: "#0f172a",
    color: "#ffffff"
  } satisfies CSSProperties,
  secondary: {
    ...buttonBaseStyle,
    backgroundColor: "#ffffff",
    borderColor: "#cbd5e1",
    color: "#0f172a"
  } satisfies CSSProperties
};
