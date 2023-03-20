"""
pelican-cleanurls

A pelican plugin to create "clean urls" from paths.

## Example:
PAGE_URL = '{cleanurl}/'
PAGE_SAVE_AS = '{cleanurl}/index.html'

page/index.html --> "" --> save_as: /index.html --> url: /
page/folder/index.html --> folder --> save_as: /folder/index.html --> url: /folder
page/folder/content.html --> folder/content --> save_as: folder/content/index.html --> url: /folder/content
page/folder1/folder2/index.html --> folder1/folder2
page/folder1/folder2/content.html --> folder1/folder2/content
"""
import logging
import re
import os.path
from pathlib import Path

from pelican import signals, contents
from typing import List, Tuple

log = logging.getLogger(__name__)

DEFAULT_EXCLUDE_PAGE_PATHS = True
DEFAULT_ONLY_PAGE_PATHS = True
DEFAULT_EXCLUDE_HEAD_RE = None
DEFAULT_EXCLUDE_TAIL_RE = re.compile(r"index\.[^/.]*")
DEFAULT_SPECIAL_LIST = [(r"error\.[^.]*", "error.html", "error.html")]


def transform_path(
    exclude_page_paths: bool,
    exclude_head_re: str,
    exclude_tail_re: str,
    page_paths: List[str],
    special_list: List[Tuple[str, str, str]],
    path_str: str,
) -> Tuple[str, str]:
    """transform a path to clean urls

    Args:
        exclude_page_paths (bool): from settings (pelicanconf.py)
        exclude_head_re (str): from settings (pelicanconf.py)
        exclude_tail_re (str): from settings (pelicanconf.py)
        page_paths (list): from settings (pelicanconf.py)
        special_list (list(tuple(str,str, str))):
            a list of [regex, cleanurl, cleanurl_saves] that will get processed
            without change
        path_str (str): from content_object.relative_source_path

    Returns:
        str: cleanurl
        str: cleanurl_saveas
    """
    path = Path(path_str)
    parts = list(path.parts)

    if exclude_page_paths and len(parts) > 1:
        if parts[0] in page_paths:
            parts = parts[1:]

    found_special = False
    if len(special_list) > 0:
        for (special_regex, special_url, special_saveas) in special_list:
            match = re.match(special_regex, os.path.join(*parts))
            if match:
                cleanurl = special_url
                cleanurl_saveas = special_saveas
                found_special = True
                break

    if not found_special:
        if exclude_head_re and len(parts) > 1:
            match = re.match(exclude_head_re, parts[0])
            if match:
                parts = parts[1:]

        if exclude_tail_re:
            match = re.match(exclude_tail_re, parts[-1])
            if match:
                if len(parts) > 1:
                    parts = parts[0:-1]
                else:
                    parts = [""]
        # Drop ext
        parts[-1] = Path(parts[-1]).stem

        clean_path = os.path.join(*parts)
        cleanurl = clean_path
        cleanurl_saveas = os.path.join(clean_path, "index.html")

    return cleanurl, cleanurl_saveas


def add_metadata(page: contents.Page):
    """_summary_

    Args:
        page (class Content from pelican contentys.py):
            from signals.content_object_init.connect()
    """

    cleanurl, cleanurl_saveas = transform_path(
        page.settings.get("CLEANURL_EXCLUDE_PAGE_PATHS", DEFAULT_EXCLUDE_PAGE_PATHS),
        page.settings.get("CLEANURL_EXCLUDE_HEAD_RE", DEFAULT_EXCLUDE_HEAD_RE),
        page.settings.get("CLEANURL_EXCLUDE_TAIL_RE", DEFAULT_EXCLUDE_TAIL_RE),
        page.settings.get("PAGE_PATHS", []),
        page.settings.get("CLEANURL_SPECIAL_LIST", DEFAULT_SPECIAL_LIST),
        page.relative_source_path,
    )

    log.warning(f"{page.relative_source_path:40} ==> {cleanurl:35} ==> {cleanurl_saveas}")

    page.metadata['cleanurl'] = cleanurl
    page.metadata['cleanurl_saveas'] = cleanurl_saveas

def register():
    """
    register pelican signal
    """
    signals.content_object_init.connect(add_metadata)
