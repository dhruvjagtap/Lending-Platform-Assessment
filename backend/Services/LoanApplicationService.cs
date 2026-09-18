using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class LoanApplicationService
{
    private readonly AppDbContext _context;

    public LoanApplicationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<LoanApplication> CreateLoanApplicationAsync(LoanApplication loanApplication)
    {
        loanApplication.CreatedAt = DateTime.UtcNow;

        _context.LoanApplications.Add(loanApplication);
        await _context.SaveChangesAsync();

        return loanApplication;
    }

    public async Task<List<LoanApplication>> GetAllLoanApplicationsAsync()
    {
        return await _context.LoanApplications
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<List<LoanApplication>> GetLoanApplicationsByDecisionAsync(string decision)
    {
        return await _context.LoanApplications
            .Where(x => x.Decision == decision)
            .ToListAsync();
    }
}