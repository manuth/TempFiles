import { TempDirectoryTests } from "./TempDirectory.test";
import { TempFileTests } from "./TempFile.test";
import { TempFileSystemTests } from "./TempFileSystem.test";

suite(
    "TempFiles",
    () =>
    {
        TempFileSystemTests();
        TempFileTests();
        TempDirectoryTests();
    });
