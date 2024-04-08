from invoke import task


def install(c):
    """Install dependencies with poetry. No root python package."""
    c.run('poetry install --no-root')
    with c.cd('windmap'):
        c.run('npm install')
