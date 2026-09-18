namespace backend.DTOs;

public class StatisticsResponse
{
    public int TotalApplicants { get; set; }

    public int SuccessfulApplicants { get; set; }

    public int DeclinedApplicants { get; set; }

    public decimal TotalLoanValue { get; set; }

    public decimal MeanLtv { get; set; }
}