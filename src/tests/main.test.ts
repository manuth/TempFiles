import { TempDirectoryTests } from "./TempDirectory.test";
import { TempFileTests } from "./TempFile.test";
import { TempFileSystemTests } from "./TempFileSystem.test";

suite(
    "TempFileSystem",
    () =>
    {
        TempFileSystemTests();
        TempFileTests();
        TempDirectoryTests();
    });
