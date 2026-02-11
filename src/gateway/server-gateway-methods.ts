export function composeGatewayMethods(
  ...methodGroups: ReadonlyArray<ReadonlyArray<string>>
): string[] {
  const seen = new Set<string>();
  const resolved: string[] = [];
  for (const methods of methodGroups) {
    for (const method of methods) {
      if (seen.has(method)) {
        continue;
      }
      seen.add(method);
      resolved.push(method);
    }
  }
  return resolved;
}
