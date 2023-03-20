AUTHOR = 'rrosen326@gmail.com'
SITENAME = 'WA Boardsailing'
SITEURL = ''

PATH = 'content'

TIMEZONE = 'America/Los_Angeles'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('Pelican', 'https://getpelican.com/'),
         ('Python.org', 'https://www.python.org/'),
         ('Jinja2', 'https://palletsprojects.com/p/jinja/'),
         ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

DEFAULT_PAGINATION = False

THEME = "theme"

LIVERELOAD = True

# Disable page creation of pages I don't care about
ARCHIVES_SAVE_AS = ''
AUTHORS_SAVE_AS = ''
CATEGORIES_SAVE_AS = ''
TAGS_SAVE_AS = ''

STATIC_PATHS = ['images']
ARTICLE_PATHS = ['articles']
PAGE_PATHS = ['pages']


PLUGINS=["pelican_path_metadata"]
STATIC_URL = '{path}'
STATIC_SAVE_AS = '{path}'
PAGE_URL = '{cleanurl}'
PAGE_SAVE_AS = '{cleanurl_saveas}'
INDEX_SAVE_AS = ''
