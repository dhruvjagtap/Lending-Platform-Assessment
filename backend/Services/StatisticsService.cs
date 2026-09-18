using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class StatisticsService
{
    private readonly AppDbContext _context;

    public StatisticsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<int> GetSuccessfulApplicantCountAsync()
    {
        return await _context.LoanApplications.CountAsync(x => x.Decision == "Successful");
    }

    public async Task<int> GetDeclinedApplicantCountAsync()
    {
        return await _context.LoanApplications.CountAsync(x => x.Decision == "Declined");
    }

    public async Task<decimal> GetTotalLoanValueAsync()
    {
        return await _context.LoanApplications.Where(x => x.Decision == "Successful").SumAsync(x => x.LoanAmount);
    }

    public async Task<decimal> GetMeanLtvAsync()
    {
        var average = await _context.LoanApplications.Select(x => (decimal?)x.Ltv).AverageAsync();

        return Math.Round(average ?? 0m, 2);
    }

    public async Task<int> GetTotalApplicantCountAsync()
    {   
        return await _context.LoanApplications.CountAsync();
    }
}