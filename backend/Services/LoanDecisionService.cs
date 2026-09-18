namespace backend.Services;
using backend.Models;

public class LoanDecisionService
{
    public string MakeDecision(LoanApplication application)
    {
        decimal loanAmount = application.LoanAmount;
        int creditScore = application.CreditScore;
        decimal ltv = application.Ltv;

        if (loanAmount < 100000 || loanAmount > 1500000)
        {
            return "Declined";
        }

        if (loanAmount >= 1000000)
        {
            if (ltv > 60 || creditScore < 950)
            {
                return "Declined";
            }

            return "Successful";
        }

        if (ltv < 60)
        {
            return creditScore >= 750 ? "Successful" : "Declined";
        }

        if (ltv < 80)
        {
            return creditScore >= 800 ? "Successful" : "Declined";
        }

        if (ltv < 90)
        {
            return creditScore >= 900 ? "Successful" : "Declined";
        }

        return "Declined";
    }

    public decimal CalculateLtv(decimal loanAmount, decimal assetValue)
    {
        if (assetValue <= 0)
        {
            throw new ArgumentException("Asset value must be greater than zero.");
        }

        return (loanAmount / assetValue) * 100;
    }
}