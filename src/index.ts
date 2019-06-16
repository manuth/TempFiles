import { DirResult, FileResult } from "tmp";
export { TmpNameOptions, FileOptions, DirOptions, FileResult, DirResult } from "tmp";
export { TempFileSystem } from "./TempFileSystem";
export { TempFile } from "./TempFile";
export { TempDirectory } from "./TempDirectory";

/**
 * Provides information about a temporary filesystem-entry.
 */
export type TmpNameResult = FileResult | DirResult;