import { fileSync, FileResult } from "tmp";
import { FileOptions } from ".";
import { TempFileSystem } from "./TempFileSystem";

/**
 * Represents a temporary file.
 */
export class TempFile extends TempFileSystem<FileOptions>
{
    /**
     * Initializes a new instance of the `TempFile` class.
     *
     * @param options
     * The options for the initialization.
     */
    public constructor(options?: FileOptions)
    {
        super(options);
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The temporary directory.
     */
    protected CreateFileEntry(): FileResult
    {
        return fileSync(this.Options);
    }
}
