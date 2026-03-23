export function normalizeActionError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while processing the travel request.";
}
