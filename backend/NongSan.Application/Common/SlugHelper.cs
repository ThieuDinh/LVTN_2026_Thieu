using System.Text.RegularExpressions;

namespace NongSan.Application.Common;

public static class SlugHelper
{
    public static string GenerateSlug(string name)
    {
        var slug = name.ToLower().Trim();
        slug = RemoveVietnameseDiacritics(slug);
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"\s+", "-");
        slug = Regex.Replace(slug, @"-+", "-");
        slug = slug.Trim('-');
        return slug;
    }

    private static string RemoveVietnameseDiacritics(string text)
    {
        var map = new Dictionary<string, string>
        {
            { "[àáạảãâầấậẩẫăằắặẳẵ]", "a" },
            { "[èéẹẻẽêềếệểễ]", "e" },
            { "[ìíịỉĩ]", "i" },
            { "[òóọỏõôồốộổỗơờớợởỡ]", "o" },
            { "[ùúụủũưừứựửữ]", "u" },
            { "[ỳýỵỷỹ]", "y" },
            { "[đ]", "d" }
        };

        foreach (var (pattern, replacement) in map)
            text = Regex.Replace(text, pattern, replacement);

        return text;
    }
}
