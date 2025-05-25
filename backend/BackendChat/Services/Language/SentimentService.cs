using Azure;
using Azure.AI.TextAnalytics;

namespace BackendChat.Services.Language;

public sealed class SentimentService : ISentimentService
{
    private readonly IConfiguration _config;

    public SentimentService(IConfiguration config)
    {
        _config = config;
    }

    public async Task<TextSentiment> RetrieveTextSentimentAsync(string text)
    {
        var client = new TextAnalyticsClient(
            new Uri(_config["LanguageService:Url"]!),
            new AzureKeyCredential(_config["LanguageService:Key"]!));

        var sentimentResponse = await client.AnalyzeSentimentAsync(text);

        return sentimentResponse.Value.Sentiment;
    }
}