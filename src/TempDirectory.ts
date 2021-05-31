import { join } from "path";
import { emptyDirSync } from "fs-extra";
import { ITempFileSystemOptions } from "./ITempFileSystemOptions";
import { TempFileSystem } from "./TempFileSystem";

/**
 * Represents a temporary directory.
 */
export class TempDirectory extends TempFileSystem
{
    /**
     * Initializes a new instance of the `TempDirectory` class.
     *
     * @param options
     * The options for the initialization.
     */
    public constructor(options?: ITempFileSystemOptions)
    {
        super(options);
    }

    /**
     * @inheritdoc
     */
    public override Dispose(): void
    {
        super.Dispose();
    }

    /**
     * Joins the arguments together and returns the path contained by the temporary directory.
     *
     * @param path
     * The path that is to be joined.
     *
     * @returns
     * The joined path relative to the temporary directory.
     */
    public MakePath(...path: string[]): string
    {
        return join(this.FullName, ...path);
    }

    /**
     * @inheritdoc
     */
    protected CreateFileSystemEntry(): void
    {
        emptyDirSync(this.FullName);
    }
}
