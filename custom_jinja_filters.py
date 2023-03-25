"""
Custom jinja filters
"""

import random
from collections.abc import Sequence
from typing import List, TypeVar

T = TypeVar("T")


def split(value, sep, maxsplit=-1, strip=False) -> List | None:
    """
    Same usage as str.split() as a jinja filter

    strip == True - also strip each returned el
    """
    if not isinstance(value, str):
        return None
    parts = value.split(sep, maxsplit)
    return [el.strip() if isinstance(el, str) and strip else el for el in parts]


def el(value: T, idx: int) -> T: # pylint: disable=invalid-name
    """
    If T = List, returns value[idx]
    else: None
    """
    if not isinstance(value, Sequence):
        return None
    return value[idx]


def shuffle(value: List) -> List:
    """
    Returns a shuffled version of value
    """
    if not isinstance(value, List):
        return value
    copied = value.copy()
    random.shuffle(copied)
    return copied
