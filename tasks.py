# -*- coding: utf-8 -*-

import os
import shlex
import shutil

from invoke import task
from pathlib import Path
from PIL import Image
from invoke.main import program
from invoke.util import cd
from pelican import main as pelican_main
from pelican.settings import DEFAULT_CONFIG, get_settings_from_file

os.chdir(Path(__file__).resolve().parent)


OPEN_BROWSER_ON_SERVE = True
SETTINGS_FILE_BASE = "pelicanconf.py"
SETTINGS = {}
SETTINGS.update(DEFAULT_CONFIG)
LOCAL_SETTINGS = get_settings_from_file(SETTINGS_FILE_BASE)
SETTINGS.update(LOCAL_SETTINGS)

CONFIG = {
    "settings_base": SETTINGS_FILE_BASE,
    "settings_publish": "publishconf.py",
    "deploy_path": SETTINGS["OUTPUT_PATH"],
    "host": "localhost",
    "port": 8000,
    "s3bucket": SETTINGS["S3_BUCKET"],
    "cloudfront_distribution_id": SETTINGS["CLOUDFRONT_DISTRIBUTION_ID"],
}


@task
def clean(c):
    """Remove generated files"""
    if os.path.isdir(CONFIG["deploy_path"]):
        shutil.rmtree(CONFIG["deploy_path"])
        os.makedirs(CONFIG["deploy_path"])


@task
def build(c):
    """Build local version of site"""
    pelican_run("-d -s {settings_base}".format(**CONFIG))


@task
def regenerate(c):
    """Automatically regenerate site upon file modification"""
    pelican_run("-r -s {settings_base}".format(**CONFIG))


@task
def serve(c):
    """Serve a development version of the site"""
    from livereload import Server

    def cached_build():
        cmd = "-s {settings_base} -e CACHE_CONTENT=true LOAD_CONTENT_CACHE=true"
        pelican_run(cmd.format(**CONFIG))

    cached_build()
    server = Server()
    theme_path = SETTINGS["THEME"]
    watched_globs = [
        CONFIG["settings_base"],
        "{}/templates/**/*.html".format(theme_path),
    ]

    content_file_extensions = [".md", ".rst"]
    for extension in content_file_extensions:
        content_glob = "{0}/**/*{1}".format(SETTINGS["PATH"], extension)
        watched_globs.append(content_glob)

    static_file_extensions = [".css", ".js"]
    for extension in static_file_extensions:
        static_file_glob = "{0}/static/**/*{1}".format(theme_path, extension)
        watched_globs.append(static_file_glob)

    for glob in watched_globs:
        server.watch(glob, cached_build)

    if OPEN_BROWSER_ON_SERVE:
        # Open site in default browser
        import webbrowser

        webbrowser.open("http://{host}:{port}".format(**CONFIG))

    server.serve(host=CONFIG["host"], port=CONFIG["port"], root=CONFIG["deploy_path"])


def pelican_run(cmd):
    cmd += " " + program.core.remainder  # allows to pass-through args to pelican
    pelican_main(shlex.split(cmd))


@task
def upload(c):
    build(c)
    c.run(f"aws s3 sync {CONFIG['deploy_path']}/ {CONFIG['s3bucket']}  --delete")
    c.run(
        f"aws cloudfront create-invalidation --distribution-id {CONFIG['cloudfront_distribution_id']} --paths '/*'"
    )


@task
def format(c):
    c.run("ruff format .")


@task
def scale_images(c):
    """
    For every image file in content/images_raw:
    - Scale image to 1920px width, max
    - Save to content/images
    - Using pathlib
    """
    print("\n\nCreating scaled images")
    source_dir = Path("content/images_raw")
    destination_dir = Path("content/images")
    destination_dir.mkdir(parents=True, exist_ok=True)
    extensions = [".jpeg", ".jpg", ".png", ".ico", ".heic"]

    for image_path in source_dir.rglob("*"):
        if image_path.suffix.lower() in extensions:
            with Image.open(image_path) as img:
                if img.width > 1920:
                    print(f"\033[1m\033[97mScaling {image_path.name}\033[0m")
                    new_height = int((1920 / img.width) * img.height)
                    img = img.resize((1920, new_height), Image.Resampling.LANCZOS)
                else:
                    print(f"\033[90mCopying {image_path.name}\033[0m")
                dest_file = destination_dir / image_path.relative_to(source_dir)
                dest_file.parent.mkdir(parents=True, exist_ok=True)
                img.save(dest_file)
    print()
