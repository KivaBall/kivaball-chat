using Azure.AI.TextAnalytics;

namespace BackendChat.Services.Language;

public interface ISentimentService
{
    Task<TextSentiment> RetrieveTextSentimentAsync(string text);
}