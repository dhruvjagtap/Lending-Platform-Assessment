using backend.Models;
using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApplicationController : ControllerBase
{
    private readonly LoanApplicationService _loanApplicationService;
    private readonly LoanDecisionService _loanDecisionService;

    public ApplicationController(
        LoanApplicationService loanApplicationService,
        LoanDecisionService loanDecisionService)
    {
        _loanApplicationService = loanApplicationService;
        _loanDecisionService = loanDecisionService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateApplication(LoanApplication application)
    {
        if (application.AssetValue <= 0)
        {
            return BadRequest("Asset value must be greater than zero.");
        }

        if (application.LoanAmount <= 0)
        {
            return BadRequest("Loan amount must be greater than zero.");
        }

        if (application.CreditScore < 1 || application.CreditScore > 999)
        {
            return BadRequest("Credit score must be between 1 and 999.");
        }

        application.Ltv = Math.Round(
            _loanDecisionService.CalculateLtv(
                application.LoanAmount,
                application.AssetValue
            ),
            2
        );

        application.Decision = _loanDecisionService.MakeDecision(application);

        var createdApplication = await _loanApplicationService.CreateLoanApplicationAsync(application);

        return Ok(createdApplication);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllApplications()
    {
        var applications = await _loanApplicationService.GetAllLoanApplicationsAsync();

        return Ok(applications);
    }

    [HttpGet("decision/{decision}")]
    public async Task<IActionResult> GetApplicationsByDecision(
        string decision)
    {
        var applications = await _loanApplicationService.GetLoanApplicationsByDecisionAsync(decision);

        return Ok(applications);
    }
}