namespace backend.Data;
using Microsoft.EntityFrameworkCore;
using backend.Models;

public class AppDbContext: DbContext
{
    public AppDbContext (DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<LoanApplication> LoanApplications { get; set; }
}