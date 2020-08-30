import { DirResult, FileResult } from "tmp";

/**
 * Provides information about a temporary filesystem-entry.
 */
export type TempResult = FileResult | DirResult;
