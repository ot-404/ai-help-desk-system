"""Web search using DuckDuckGo — no API key required."""
import requests
from bs4 import BeautifulSoup

try:
    from duckduckgo_search import DDGS
    _DDGS_AVAILABLE = True
except ImportError:
    _DDGS_AVAILABLE = False

_FETCH_TIMEOUT = 8
_MAX_PAGE_CHARS = 2000


def _fetch_page_text(url):
    """Fetch a URL and return clean readable text (truncated)."""
    try:
        resp = requests.get(url, timeout=_FETCH_TIMEOUT, headers={"User-Agent": "Mozilla/5.0"})
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header"]):
            tag.decompose()
        text = " ".join(soup.get_text(separator=" ").split())
        return text[:_MAX_PAGE_CHARS]
    except Exception:
        return ""


def web_search(query, max_results=4):
    """Return a list of context strings from DuckDuckGo web search.

    Each entry is: "SOURCE: <url>\\n<snippet or page text>"
    Returns [] if duckduckgo-search is not installed or search fails.
    """
    if not _DDGS_AVAILABLE:
        return []
    try:
        results = []
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=max_results):
                url = r.get("href", "")
                snippet = r.get("body", "")
                # Try to fetch fuller page text; fall back to snippet
                page_text = _fetch_page_text(url) if url else ""
                content = page_text if len(page_text) > len(snippet) else snippet
                if content:
                    results.append(f"SOURCE: {url}\n{content}")
        return results
    except Exception:
        return []
