const RESUME_MARGIN = 5;

/** Saved positions are only restored if they are inside the recording and not right at the end. */
export const shouldRestore = (saved: number | undefined, total: number): saved is number =>
  typeof saved === 'number' && saved > 1 && saved < total - RESUME_MARGIN;
