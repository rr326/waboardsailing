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

ARTICLE_PATHS = ['articles']
PAGE_PATHS = ['pages']
# PAGE_URL = '{all_but_index}'
# PAGE_SAVE_AS = '{all_but_index}index.html'
# PATH_METADATA = r"^pages(?P<all_but_index>((?=/index)(/))|((?=.+/index\..*)(.*)(?=/index\.))|((?!.*/index\.)(.*)(?=\.))).*$"
PAGE_URL = '{slug}/'
PAGE_SAVE_AS = '{slug}/index.html'
SLUGIFY_SOURCE = 'basename'


PLUGIN_PATHS=["plugins"]
PLUGINS=["pelican-page-hierarchy"]
