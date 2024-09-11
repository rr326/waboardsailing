import os
import sys

sys.path.append(os.curdir)
from custom_jinja_filters import split, el, shuffle, markdown

JINJA_FILTERS = {"split": split, "el": el, "shuffle": shuffle, "markdown": markdown}


AUTHOR = "Ross Rosen"
SITENAME = "WA Boardsailing"
SITEURL = "waboardsailing.org"
OUTPUT_PATH = "dist"
PATH = "content"
TIMEZONE = "America/Los_Angeles"
DEFAULT_LANG = "en"
CLOUDFRONT_DISTRIBUTION_ID = "E10UTPV32WD7RO"
S3_BUCKET = "s3://www.waboardsailing.org"

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = ()

# Social widget
SOCIAL = ()

DEFAULT_PAGINATION = False

THEME = "theme"

# LIVERELOAD = True
USE_GOOGLE_ANALYTICS = False

# Disable page creation of pages I don't care about
ARCHIVES_SAVE_AS = ""
AUTHORS_SAVE_AS = ""
CATEGORIES_SAVE_AS = ""
TAGS_SAVE_AS = ""

STATIC_PATHS = ["images"]
ARTICLE_PATHS = ["articles"]
PAGE_PATHS = ["pages"]


PLUGINS = ["pelican_cleanurl"]
STATIC_URL = "{path}"
STATIC_SAVE_AS = "{path}"
PAGE_URL = "{cleanurl}"
PAGE_SAVE_AS = "{cleanurl_saveas}"
INDEX_SAVE_AS = ""
