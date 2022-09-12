import { join } from "node:path";
import fs from "fs-extra";
import path from "upath";
import { ITempFileSystemOptions } from "./ITempFileSystemOptions.js";
import { TempFileSystem } from "./TempFileSystem.js";

const { emptyDirSync } = fs;
const { dirname, isAbsolute, normalize, relative, sep } = path;

/**
 * Represents a temporary directory.
 */
export class TempDirectory extends TempFileSystem
{
    /**
     * Initializes a new instance of the {@link TempDirectory `TempDirectory`} class.
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
        let relativePath = normalize(relative(this.FullName, process.cwd()));

        if (
            !isAbsolute(relativePath) &&
            relativePath.split(sep)[0] !== "..")
        {
            process.chdir(dirname(this.FullName));
        }

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
