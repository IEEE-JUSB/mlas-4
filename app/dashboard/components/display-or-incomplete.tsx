import { IncompleteMarker } from "./incomplete-marker";

function isValueMissing(value: unknown) {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim().length === 0)
  );
}

export function displayOrIncomplete(value: unknown) {
  if (isValueMissing(value)) {
    return <IncompleteMarker />;
  }

  return String(value);
}
