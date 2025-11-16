using System.ComponentModel.DataAnnotations;

namespace ProyectHub.Config;

public sealed class FrontendOptions
{
    public const string SectionName = "Frontend";

    [Url]
    public string Url { get; set; } = "http://localhost:5173";
}
