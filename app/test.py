from lncrawl.core.app import App
from lncrawl.core.crawler import Crawler
from lncrawl.core.sources import crawler_list, load_sources, prepare_crawler
from lncrawl.models.formats import OutputFormat
from lncrawl.utils.uploader import upload

available_formats = [OutputFormat.epub, OutputFormat.text, OutputFormat.web]

load_sources()
# print(crawler_list)
app = App()

app.user_input = (
    "https://puretl.com/epiphanies-of-rebirth/category/Epiphanies+of+Rebirth"
)

app.prepare_search()
disable_search = True

if app.crawler:
    print("Got your page link")
    app.get_novel_info()
    app.output_path = "../out"
    app.chapters = app.crawler.chapters[0:2]
    app.output_formats = {"epub": True, "text": True, "web": True}
    app.pack_by_volume = False
    print(
        "**%s**" % app.crawler.novel_title,
        "Downloading %d chapters..." % len(app.chapters),
    )
    app.start_download()

    app.bind_books()

    print("Compressing output folder...")
    app.compress_books()

    assert isinstance(app.archived_outputs, list)
    for archive in app.archived_outputs:
        print("archive " + archive)


elif app.user_input and len(app.user_input) < 4:
    print("Your query is too short")
else:
    if disable_search:
        print(
            "Sorry! I can not do searching.\n"
            "Please use Google to find your novel first"
        )
        # get_novel_url()
    else:
        print(
            'Searching %d sources for "%s"\n'
            % (len(app.crawler_links), app.user_input),
        )
        app.search_novel()
