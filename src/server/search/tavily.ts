export type TavilySearchResult = {
  title: string;
  url: string;
  content: string;
};

export async function searchTravelResearch(query: string): Promise<TavilySearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    return [];
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "advanced",
        max_results: 5,
      }),
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as {
      results?: Array<{
        title?: string;
        url?: string;
        content?: string;
      }>;
    };

    return (payload.results ?? []).map((result) => ({
      title: result.title ?? "",
      url: result.url ?? "",
      content: result.content ?? "",
    }));
  } catch {
    return [];
  }
}
