import { TempDirectoryTests } from "./TempDirectory.test.js";
import { TempFileTests } from "./TempFile.test.js";
import { TempFileSystemTests } from "./TempFileSystem.test.js";

suite(
    "TempFiles",
    () =>
    {
        TempFileSystemTests();
        TempFileTests();
        TempDirectoryTests();
    });
