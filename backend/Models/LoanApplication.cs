namespace backend.Models;

public class LoanApplication
{
    public int Id { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public decimal LoanAmount { get; set; }

    public decimal AssetValue { get; set; }

    public int CreditScore { get; set; }

    public decimal Ltv { get; set; }

    public string Decision { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}