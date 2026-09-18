using backend.Models;

namespace backend.DTOs;

public class DashboardResponse
{
    public StatisticsResponse Statistics { get; set; } = new();

    public List<LoanApplication> Applications { get; set; } = new();
}