import Path = require("path");
import FileSystem = require("fs-extra");
import { dirSync } from "tmp";
import { DirOptions } from ".";
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
    public constructor(options?: DirOptions)
    {
        super(options);
    }

    /**
     * @inheritdoc
     */
    public Dispose(): void
    {
        FileSystem.emptyDirSync(this.FullName);
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
        return Path.join(this.FullName, ...path);
    }

    /**
     * @inheritdoc
     *
     * @param options
     * The options for the initialization.
     */
    protected Initialize(options: DirOptions): void
    {
        this.TempFileSystemEntry = dirSync(options);
    }
}
