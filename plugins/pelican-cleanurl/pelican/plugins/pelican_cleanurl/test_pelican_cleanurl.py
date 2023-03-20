from functools import partial
from pelican_cleanurl import (
    transform_path,
    DEFAULT_EXCLUDE_PAGE_PATHS,
    DEFAULT_EXCLUDE_HEAD_RE,
    DEFAULT_EXCLUDE_TAIL_RE,
    DEFAULT_SPECIAL_LIST,
)


def test_normal():
    paths = [
        "pages/index.md",
        "pages/error.md",
        "pages/folder1/index.md",
        "pages/folder1/contents1.html",
        "pages/folder1/contents2.html",
        "pages/folder1/folder2/index.html",
        "pages/folder1/folder2/contents1.html",
        "pages/folder1/folder2/contents2.html",
    ]
    transform = partial(
        transform_path,
        DEFAULT_EXCLUDE_PAGE_PATHS,
        DEFAULT_EXCLUDE_HEAD_RE,
        DEFAULT_EXCLUDE_TAIL_RE,
        ["pages"],
        DEFAULT_SPECIAL_LIST,
    )

    for path in paths:
        cleanurl, cleanurl_saveas = transform(path)
        print(f"{path:40} ==> {cleanurl:35} ==> {cleanurl_saveas}")


def test_actual():
    paths = [
        "pages/map.html",
        "pages/index.html",
        "pages/resources/getting_started.md",
        "pages/resources/index.md",
        "pages/error.md",
        "pages/sites/ssp.md",
        "pages/sites/index.md",
        "pages/sites/mags.md",
        "pages/forecast.md",
        "pages/contributing.md",
        "pages/warning.md",
        "pages/all.md",
    ]
    transform = partial(
        transform_path,
        DEFAULT_EXCLUDE_PAGE_PATHS,
        DEFAULT_EXCLUDE_HEAD_RE,
        DEFAULT_EXCLUDE_TAIL_RE,
        ["pages"],
        DEFAULT_SPECIAL_LIST,
    )

    for path in paths:
        cleanurl, cleanurl_saveas = transform(path)
        print(f"{path:40} ==> {cleanurl:35} ==> {cleanurl_saveas}")


if __name__ == "__main__":
    test_normal()
    test_actual()
